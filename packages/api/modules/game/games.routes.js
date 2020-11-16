import _ from 'lodash';
import url from 'url';

import * as securityService from '../security/security.service.js';

const gameRooms = {};

class GameRoom {
  constructor({ owner }) {
    this.users = {
      [owner.userId]: owner,
    };
  }

  get sockets() {
    return _.map(this.users, 'socket');
  }

  get socketsByUserId() {
    return _.mapValues(this.users, 'socket');
  }

  sendTo({ userId, message }) {
    const socketFromUserId = _.get(this.users, [userId, 'socket']);

    if (!socketFromUserId) return;

    socketFromUserId.send(message);
  }

  sendToEveryone({ message, withoutUserIds = [] }) {
    _.chain(this.socketsByUserId)
      .filter((_socket, userId) => withoutUserIds.includes(userId))
      .forEach((_socket, userId) => this.sendTo({ userId, message }));
  }

  addUser({ userId, socket }) {
    if (this.users[userId]) return;
    
    this.users[userId] = {
      userId,
      socket,
    };

    this.sendToEveryone({ message: { name: 'user-joined', payload: { user: { name: 'Léo' } } } });
  }

  removeUser({ userId }) {
    delete this.users[userId];
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
      try {
        const { roomId } = params;
        // this will handle websockets connections
        conn.setEncoding('utf8');
        const { token } = url.parse(request.url, true).query;

        const user = await securityService.authenticateUserFromToken({ token });

        const gameRoom = gameRooms[roomId];
      
        if (!gameRoom) {
          app.log.info({
            key: 'games.rooms.created',
            message: 'New room created by user',
            authorId: user._id,
          });
          gameRooms[roomId] = new GameRoom({
            owner: {
              userId: user._id,
              socket: conn.socket,
            },
          });
          conn.write(JSON.stringify(user));
        } else {
          gameRoom.addUser({ userId: user._id, socket: conn.socket });
        }
      } catch (err) {
        conn.end();
      }
    }
  };
}

export default async (app) => {
  app.route(gamesRoomRoute(app));
  
}
