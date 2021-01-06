const { host, protocol } = window?.location || {};
const socketProtocol = protocol === 'http:' ? 'ws:' : 'wss:';

export default {
  apiUrl: process.env.NODE_ENV === 'production' ? `${protocol}//${host}/api` : 'http://localhost:3000/api',
  socketUrl: process.env.NODE_ENV === 'production' ? `${socketProtocol}://${host}/api` : 'ws://localhost:3000/api',
};
