import _ from 'lodash';
import url from 'url';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { StateMachine } from '../../state-machine/index.js';

import * as quizzesService from '../quizzes/quizzes.service.js';
import * as authService from '../auth/auth.service.js';
import * as gamesSchema from './games.schema.js';
import { onIdleState } from './idle.state.js';
import { onStartTransition } from './start.transition.js';
import { onStartedState } from './started.state.js';

const gameRooms = {};

class GameRoom {
  constructor({ owner, quiz, logger }) {
    this.$ = {
      players$: new BehaviorSubject([]),
      messages$: new Subject(),
    };

    this.logger = logger;
    this.state = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'start', from: 'idle', to: 'started' },
        { name: 'finish', from: 'started', to: 'finished' },
      ],
      methods: {
        // On entering state
        onEnterState: ({ state }) => {
          logger.info({
            state,
          }, '[state] applying new state');
          this.sendToEveryone({
            message: {
              name: 'game-state',
              payload: state,
            }
          });
        },
        // Before a transition is called
        onEnterTransition: ({ transition }) => {
          logger.info({
            transition,
          }, '[transition] executing transition');
          this.sendToEveryone({
            message: {
              name: 'game-transition',
              payload: transition,
            }
          });
        },
        // Waiting for owner to start the game
        onIdleState: () => onIdleState({
          messages$: this.$.messages$,
          ownerUserId: owner.userId,
          start: () => this.state.run({ transition: 'start' }),
        }),
        // Timeout of X seconds or awaiting all players ready status
        onStartTransition: () => onStartTransition({
          messages$: this.$.messages$,
          players$: this.$.players$,
          ownerUserId: owner.userId,
          sendToEveryone: this.sendToEveryone.bind(this),
          timeout: 3 * 1000,
        }),
        onStartedState: () => onStartedState({
          sendToEveryone: this.sendToEveryone.bind(this),
          ownerUserId: owner.userId,
          messages$: this.$.messages$,
          players$: this.$.players$,
          quiz: this.quiz,
          finish: () => this.state.run({ transition: 'finish' }),
        })
      },
    });
    this.owner = owner;
    this.quiz = quiz;
    this.users = {};
  }
  
  /**
   * Utils
   */
  get sockets() {
    return _.map(this.users, 'socket');
  }

  get socketsByUserId() {
    return _.mapValues(this.users, 'socket');
  }

  handleMessage({ userId, message }) {
    try {
      const { name, payload = {} } = JSON.parse(message);

      this.$.messages$.next({ userId, name, payload });
    } catch (err) {
      this.logger.error(err);
    }
  }

  isOwner({ userId }) {
    return this.owner.userId === userId;
  }

  sendTo({ userId, message }) {
    const socketFromUserId = _.get(this.users, [userId, 'socket']);

    if (!socketFromUserId) {
      this.logger.warn({ sendTo: userId, message }, 'unable to send');
      return;
    }
    
    this.logger.info({ sendTo: userId, message });
    socketFromUserId.send(JSON.stringify(message));
  }

  sendToEveryone({ message, without = [] }) {
    _(this.socketsByUserId)
      .pickBy((_socket, userId) => !without.includes(userId))
      .forEach((_socket, userId) => this.sendTo({ userId, message }));
  }

  addUser({ userId, pseudo, socket }) {
    this.logger.info({ userId }, 'Adding user to game room');
    if (this.users[userId]) {
      throw new Error('User is already in room!');
    };

    this.users[userId] = {
      userId,
      socket,
      pseudo,
      isOwner: userId === this.owner.userId,
    };

    this.$.players$.next(Object.values(this.users));

    this.sendToEveryone({
      message: {
        name: 'user-joined',
        payload: { userId, pseudo },
      },
      without: [userId],
    });
    this.sendTo({
      userId,
      message: {
        name: 'user-list',
        payload: _.map(this.users, (user) => _.pick(user, 'userId', 'pseudo', 'isOwner'))
      }
    });
    this.sendTo({
      userId,
      message: {
        name: 'quiz-data',
        payload: _.pick(this.quiz, 'name', 'createdAt', 'updatedAt', 'owner'),
      }
    });
    this.sendTo({
      userId,
      message: {
        name: 'game-state',
        payload: this.state.getState(),
      }
    })

    socket.on('message', (message) => this.handleMessage({ userId, message }));

    socket.on('close', () => {
      this.logger.info({ userId }, 'User disconnected');
      this.removeUser({ userId });
    });
  }

  removeUser({ userId }) {
    delete this.users[userId];

    this.$.players$.next(Object.values(this.users));

    this.sendToEveryone({
      message: {
        name: 'user-left',
        payload: { userId }
      },
      without: [userId],
    });
  }
}

function createGameRoomRoute(app) {
  return {
    method: 'POST',
    url: '/',
    schema: gamesSchema.createGameRoomSchema,
    handler: async (request, reply) => {
      const { userId } = request.account;
      const { quizId } = request.body;

      try {
        const quiz = await quizzesService.findQuizOfUserOrFail({ quizId, userId });
        await quizzesService.incrementQuizPlayedCounter({ quizId });
        const roomId = _.times(6, () => _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).join('');

        const logger = app.log.child({
          roomId,
          userId,
          quizId,
        });

        const gameRoom = new GameRoom({
          logger,
          quiz: quiz.toObject(),
          owner: { userId },
        });

        gameRooms[roomId] = gameRoom;

        return { roomId };
      } catch (error) {
        reply.badRequest(error.message);
      }
    },
  }
}

function gamesRoomRoute(app) {
  return {
    method: 'GET',
    url: '/:roomId',
    handler: (req, reply) => {
      reply.send({ hello: 'world' })
    },
    wsHandler: async (conn, request, params, lol) => {
      conn.setEncoding('utf8');

      try {
        const { roomId } = params;
        if (!_.has(gameRooms, roomId)) {
          throw new Error('Room not found !');
        }

        const { token } = url.parse(request.url, true).query;
        const user = await authService.authenticateUserFromToken({ token });

        const userId = user._id.toString();

        const gameRoom = gameRooms[roomId];

        gameRoom.addUser({
          userId,
          pseudo: `${user.firstName} ${user.lastName}`,
          socket: conn.socket,
        });

      } catch (err) {
        app.log.error(err);
        conn.socket.send(JSON.stringify({
          isError: true,
          key: 'room-not-found',
          message: err.message,
        }));
        conn.end();
      }
    }
  };
}

export default async (app) => {
  app.route(createGameRoomRoute(app));
  app.route(gamesRoomRoute(app));
}
