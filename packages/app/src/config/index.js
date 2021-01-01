export default {
  appUrl: process.env.VUE_APP_URL || 'http://localhost:8080',
  apiUrl: process.env.VUE_APP_API_URL || 'http://localhost:3000/api',
  socketUrl: process.env.VUE_APP_SOCKET_URL || 'ws://localhost:3000/api',
};
