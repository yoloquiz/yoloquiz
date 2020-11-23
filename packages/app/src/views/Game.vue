<template>
  <div>
    <div>
      <button @click="createRoom">New room</button>
    </div>
    <Room v-if="roomId" :roomId="roomId" />
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<script>
import Room from '@/components/game/Room.vue';

export default {
  name: 'Game',
  components: {
    Room,
  },
  data() {
    return {
      roomId: undefined,
    };
  },
  created() {
    const { roomId } = this.$route.params;
    this.attemptJoinRoom({ roomId });
  },
  watch: {
    $route(to) {
      const { roomId } = to.params;
      this.attemptJoinRoom({ roomId });
    },
  },
  methods: {
    attemptJoinRoom({ roomId }) {
      if (roomId === '') {
        this.createRoom();
        return;
      }
      this.roomId = roomId;
    },
    async createRoom() {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmI2YWE2ODBkNWFlNTE0YjEyZTg4ZGEiLCJpYXQiOjE2MDU5NTk3MTEsImV4cCI6MTYwODU1MTcxMX0.45KNauIVfcm305P20OXe2ndyToctCoChorqsvZAdci0';
      const headers = new Headers({
        Authorization: `Bearer ${token}`,
      });
      const response = await fetch('http://localhost:3000/games/', {
        method: 'POST',
        headers,
      });
      const { roomId } = await response.json();
      this.$router.push(`/games/${roomId}`);
    },
  },
};
</script>

<style></style>
