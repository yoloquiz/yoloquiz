<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <GameNavbar />
    <div class="flex-1 flex flex-col">
      <StateMachine />
    </div>
    <GameAdminBar v-if="isGameAdmin()" />
    <Countdown class="timer" :timer="timer" />
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import { mapGetters, useStore } from 'vuex';
import { computed, onMounted, onUnmounted, reactive, toRefs } from 'vue';

import GameNavbar from '@/modules/games/components/GameNavbar.vue';
import GameAdminBar from '@/modules/games/components/GameAdminBar.vue';
import Countdown from '@/modules/games/components/Countdown.vue';
import StateMachine from '@/modules/games/components/StateMachine.vue';
import { useNotify } from '@/plugins/notify';

export default {
  name: 'Game',
  components: {
    GameNavbar,
    GameAdminBar,
    StateMachine,
    Countdown,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const notify = useNotify();

    const { roomId } = route.params;

    const state = reactive({
      quiz: computed(() => store.state.games.quiz),
      timer: computed(() => store.state.games.timer),
    });

    onMounted(async () => {
      try {
        await store.dispatch('games/initSocketConnection', { roomId });
        notify('Le quiz est fermé ou indisponible');
      } catch (error) {
        console.log(error);
        notify.error('Connexion perdue');
      }
      router.push('/');
    });

    onUnmounted(() => {
      store.dispatch('games/closeSocketConnection');
    });

    return {
      ...toRefs(state),
      ...mapGetters('games', ['isGameAdmin']),
    };
  },
};
</script>

<style lang="scss" scoped>
.timer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
