<script>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  render: () => null,
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();

    onMounted(async () => {
      try {
        const { token, redirect } = route.query;
        if (token) {
          await store.dispatch('auth/storeAccessToken', { accessToken: token });
        }
        if (redirect) {
          router.push(redirect);
          return;
        }
        const afterAuthPath = localStorage.getItem('after_auth_path');
        if (afterAuthPath && afterAuthPath.startsWith('/')) {
          localStorage.removeItem('after_auth_path');
          router.push(afterAuthPath);
          return;
        }
        router.push('/');
      } catch (error) {
        console.error(error);
        router.push('/login');
      }
    });
  },
};
</script>
