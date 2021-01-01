<template>
  <div class="game-admin-bar bg-white w-full rounded-t-3xl pt-6 pb-4 px-4 grid gap-2 max-w-2xl mx-auto">
    <Button @click="startGame()" v-show="gameState() === 'idle'">
      Démarrer
    </Button>
    <Button @click="sendGameProceed()" v-show="correctChoices() && gameState() === 'started'">
      Suivant
    </Button>
    <Button disabled v-show="gameState() === 'finished'">
      Recommencer
    </Button>
  </div>
</template>

<script>
import Button from '@/components/ui/Button.vue';
import { mapActions, mapState } from 'vuex';

export default {
  components: {
    Button,
  },
  setup() {
    return {
      ...mapActions('games', ['startGame', 'sendGameProceed']),
      ...mapState('games', ['gameState', 'correctChoices']),
    };
  },
};
</script>

<style lang="scss" scoped>
.game-admin-bar {
  position: relative;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.1);

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 0.5rem;
    display: block;
    border-radius: 10px;
    height: 4px;
    width: 30%;
    background-color: rgba(0, 0, 0, 0.2);
  }
}
</style>
