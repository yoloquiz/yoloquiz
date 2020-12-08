<template>
  <Layout container v-if="state.accessGranted">
    <router-view></router-view>
  </Layout>
</template>

<script>
import { onMounted, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Layout from '@/components/layouts/Layout.vue';

export default {
  components: {
    Layout,
  },
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
