<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useNotify } from '@/plugins/notify';

export default {
  render: () => null,
  setup() {
    const store = useStore();
    const router = useRouter();
    const notify = useNotify();

    onMounted(() => {
      store.dispatch('auth/logout');
      notify.success('Vous êtes déconnecté. Au revoir !');
      router.push('/login');
    });
  },
};
</script>
