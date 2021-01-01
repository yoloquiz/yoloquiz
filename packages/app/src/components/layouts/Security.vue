<template>
  <router-view v-if="state.accessGranted"></router-view>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const state = reactive({
      accessGranted: false,
    });
    onMounted(async () => {
      try {
        await store.dispatch('auth/fetchUser');
        state.accessGranted = true;
      } catch (error) {
        console.error(error);
        store.dispatch('auth/logout');
        router.push('/login');
      }
    });
    return { state };
  },
};
</script>

<style></style>
