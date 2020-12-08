import _ from 'lodash';
import url from 'url';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { StateMachine } from '../../state-machine/index.js';

import * as authService from '../auth/auth.service.js';
import { onIdleState } from './idle.state.js';
import { onStartTransition } from './start.transition.js';

const gameRooms = {};

class GameRoom {
  constructor({ owner, logger }) {
    this.$ = {
      players$: new BehaviorSubject([]),
      messages$: new Subject(),
    };

    this.logger = logger;
    this.state = new StateMachine({
      init: 'idle',
      transitions: [
        { name: 'start', from: 'idle', to: 'started' },
      ],
      methods: {
        // On entering state
        onEnterState: ({ state }) => {
          logger.info({
            state,
          }, '[state] applying new state');
          this.sendToEveryone({
            message: {
              name: 'state-update',
              payload: { state },
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
              name: 'transition-update',
              payload: { transition },
            }
          });
        },
        // Waiting for owner to start the game
        onIdleState: () => onIdleState({
          messages$: this.$.messages$,
          ownerUserId: owner.userId,
          start: () => {
            this.state.run({ transition: 'start' });
          },
        }),
        // Timeout of X seconds or awaiting all players ready status
        onStartTransition: () => onStartTransition({
          messages$: this.$.messages$,
          players$: this.$.players$,
          ownerUserId: owner.userId,
          sendToEveryone: this.sendToEveryone.bind(this),
          onCancel: () => this.state.run('start'),
          timeout: 10 * 1000,
        }),
      },
    });
    this.owner = owner;
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

  addUser({ userId, socket }) {
    this.logger.info({ userId }, 'Adding user to game room');
    if (this.users[userId]) {
      throw new Error('User is already in room!');
    };

    this.users[userId] = {
      userId,
      socket,
      isOwner: userId === this.owner.userId,
    };

    this.$.players$.next(Object.values(this.users));

    this.sendToEveryone({ message: { name: 'user-joined', payload: { userId, pseudo: 'RandomPseudo?' } }, without: [userId] });

    socket.on('message', (message) => this.handleMessage({ userId, message }));

    socket.on('close', () => {
      this.logger.info({ userId }, 'User disconnected');
      this.removeUser({ userId });
    });
  }

  removeUser({ userId }) {
    delete this.users[userId];

    this.$.players$.next(Object.values(this.users));
  }
}

function createGameRoomRoute(app) {
  return {
    method: 'POST',
    url: '/',
    handler: ({ account: { userId } }, reply) => {
      const roomId = _.times(6, () => _.sample('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).join('');

      const logger = app.log.child({
        roomId,
        userId,
      });

      const gameRoom = new GameRoom({
        logger,
        owner: { userId },
      });

      gameRooms[roomId] = gameRoom;

      return { roomId };
    },
  }
}

function gamesRoomRoute(app) {
  return {
    method: 'GET',
    url: '/:roomId',
    handler: (req, reply) => {
      // this will handle http requests
      reply.send({ hello: 'world' })
    },
    wsHandler: async (conn, request, params, lol) => {
      conn.setEncoding('utf8');

      try {
        const { roomId } = params;
        if (!_.has(gameRooms, roomId)) {
          throw new Error('Room not found !');
        }

        // this will handle websockets connections
        const { token } = url.parse(request.url, true).query;
        const user = await authService.authenticateUserFromToken({ token });
        console.log({ token, user });
        const userId = user._id.toString();

        const gameRoom = gameRooms[roomId];

        gameRoom.addUser({ userId, socket: conn.socket });

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
