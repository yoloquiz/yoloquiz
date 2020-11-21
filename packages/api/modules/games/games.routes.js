import _ from 'lodash';
import url from 'url';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { StateMachine } from '../../state-machine/index.js';

import * as securityService from '../security/security.service.js';
import { onIdleState } from './idle.state.js';
import { onStartTransition } from './start.transition.js';

const gameRooms = {};

// INITIALISATION DE LA ROOM
// <--B { event: 'joining', user: { ... payload } }
// <--B { event: 'leaving', userId: '...' }

// const ws = new WebSocket('ws://lol/rooms/FUGYUEIFAO/game');
// 5fb2b20f0e087b08cab20101

// SESSION DE JEU
// --> { event: 'launch' }
// <-- { event: 'game-starting', timeout: 30 * 1000 },
// --> { event: 'ready' }
// --> { event: 'ready' }
// --> { event: 'ready' }
// <--B { event: 'game-started' }
// --> { event: 'round-starting', timeout: 3 * 1000 },
// --> { event: 'round-started', time: 30000 }
// <--B { event: 'question', payload: { avaibleAnswers: [] } }
// <-- { event: 'answer', payload: { from: 'userB' } }
// --> { event: 'anwser', payload: {...} }
// <--B { event: 'round-finished', payload: { ...SCORES }, timeout: 30 * 1000 }
// <-- { event: 'round-starting', timeout: 3 * 1000 },
// --> ...
// <--B { event: 'game-finished' }
// Affiche les scores


/**
 * State transitions methods
 */

// async function onStartTransition() {
//   const timeout = 10 * 1000;

//   this.sendToEveryone({
//     message: {
//       name: 'starting',
//       timeout: timeout,
//     },
//   });

//   const userCancelListener = async ({ userId }) => {
//     if (!this.isOwner({ userId })) return;

//     this.state.transition.cancel();
//     this.removeEventListener('user-cancel', userCancelListener);
//     this.removeEventListener('user-disconnect', userCancelListener);
//   }

//   this.on('user-cancel', userCancelListener);
//   this.on('user-disconnect', userCancelListener);

//   await waitFor(timeout);
// }

function onStartedState(context) {
  console.log('COUCOU')
}

// IDLE : on attend que l'owner lance la game
// TRANSITION IDLE => START

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
        onEnterState: ({ state }) => {
          logger.info({
            message: '[state] applying new state',
            state,
          });
        },
        // onAfterTransition: ({ transition, from, to }) => {
        //   logger.info({
        //     message: '[transition] after transition',
        //     transition,
        //     from,
        //     to,
        //   });
        // },
        onEnterTransition: ({ transition }) => {
          logger.info({
            message: '[transition] executing transition',
            transition,
          });
        },
        // Waiting for owner to start the game
        onIdleState: () => onIdleState({
          messages$: this.$.messages$,
          ownerUserId: owner.userId,
          start: () => {
            logger.info({ message: 'game started' });
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
    console.log('handleMessage', { userId, message });
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

    if (!socketFromUserId) return;

    socketFromUserId.send(JSON.stringify(message));
  }

  sendToEveryone({ message, without = [] }) {
    _.chain(this.socketsByUserId)
      .filter((_socket, userId) => without.includes(userId))
      .forEach((_socket, userId) => this.sendTo({ userId, message }));
  }

  addUser({ userId, socket }) {
    this.logger.info({ userId, message: 'Adding user to game room' });
    if (this.users[userId]) {
      throw new Error('User is already in room!');
    };

    this.users[userId] = {
      userId,
      socket,
      isOwner: userId === this.owner.userId,
    };

    this.$.players$.next(Object.values(this.users));

    this.sendToEveryone({ message: { name: 'user-joined', payload: { user: { name: 'Léo' } } }, without: [] });

    socket.on('message', (message) => this.handleMessage({ userId, message }));

    socket.on('close', () => {
      app.log.info({ userId, message: 'User disconnected' });
      this.removeUser({ userId });
    });
  }

  removeUser({ userId }) {
    this.users[userId].socket.removeAllEventListeners();
    delete this.users[userId];

    if (this.owner && userId === this.owner.userId) {
      delete this.owner;
    }

    this.$.players$.next(Object.values(this.users));
  }
}

function createGameRoomRoute(app) {
  return {
    method: 'POST',
    url: '/',
    handler: ({ account: { userId } }, reply) => {
      const roomId = `room`;

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

        const user = await securityService.authenticateUserFromToken({ token });
        const userId = user._id.toString();

        const gameRoom = gameRooms[roomId];
        if (!gameRoom) {
          return app.httpErrors.notFound();
        }

        gameRoom.addUser({ userId, socket: conn.socket });

      } catch (err) {
        app.log.error(err);
        conn.write(err.message);
        conn.end();
      }
    }
  };
}

export default async (app) => {
  app.route(createGameRoomRoute(app));
  app.route(gamesRoomRoute(app));
}
