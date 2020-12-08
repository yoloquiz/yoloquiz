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
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmI2YWI5NzU4Zjg4ZDE1Nzg1NGNiN2UiLCJpYXQiOjE2MDY1NzIxOTksImV4cCI6MTYwOTE2NDE5OX0.UpdQB1CQqDWBmXrqNeBPOaUE8uX0BDXXLjLP-XrIKig';
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
