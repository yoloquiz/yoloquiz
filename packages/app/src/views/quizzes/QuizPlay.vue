<script>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  render: () => null,
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const { quizId } = route.params;

    onMounted(async () => {
      try {
        const { roomId } = await store.dispatch('quizzes/createQuizRoom', { quizId });
        router.push({
          name: 'Game',
          params: { roomId },
        });
      } catch (error) {
        router.push({ name: 'Home' });
      }
    });
  },
};
</script>
