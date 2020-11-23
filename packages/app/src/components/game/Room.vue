<template>
  <div>
    <div v-if="connection">
      <div v-if="connectionState === 'connecting'">
        Connecting to the game...
      </div>
      <div v-else-if="connectionState === 'closed'">
        Oups !
      </div>
      <div v-else-if="connectionState === 'open'">
        Well done !
        <button @click="startGame">
          Start now
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Room',
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  watch: {
    roomId() {
      if (this.connection) this.connection.close();
      this.initConnection();
    },
  },
  data() {
    return {
      connection: null,
      socketState: undefined,
    };
  },
  created() {
    this.initConnection();
  },
  computed: {
    connectionState() {
      if (!this.socketState) return 'idle';
      if (this.socketState === WebSocket.CONNECTING) return 'connecting';
      if (this.socketState === WebSocket.OPEN) return 'open';
      if (this.socketState === WebSocket.CLOSED) return 'closed';
      return 'unknown';
    },
  },
  methods: {
    initConnection() {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmI2YWE2ODBkNWFlNTE0YjEyZTg4ZGEiLCJpYXQiOjE2MDU5NTk3MTEsImV4cCI6MTYwODU1MTcxMX0.45KNauIVfcm305P20OXe2ndyToctCoChorqsvZAdci0';
      this.connection = new WebSocket(`ws://localhost:3000/games/${this.roomId}?token=${token}`);
      this.connection.onmessage = this.handleMessage;
      this.connection.onopen = this.updateState(this.handleOpen);
      this.connection.onclose = this.updateState(this.handleClose);
    },
    updateState(handler) {
      return (...props) => {
        this.socketState = this.connection.readyState;
        handler.apply(this, props);
      };
    },
    handleMessage(event) {
      console.log(event);
    },
    handleOpen() {},
    handleClose() {},
    startGame() {
      this.connection.send('{"name": "game-start"}');
    },
  },
};
</script>

<style></style>
