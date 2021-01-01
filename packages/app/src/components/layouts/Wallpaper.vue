<template>
  <Layout
    class="bg-gray-900"
    style="background-size: 100%; background-repeat: no-repeat;"
    :style="{ 'background-image': 'url(' + require('@/assets/img/register_bg_2.png') + ')' }"
  >
    <slot />
  </Layout>
</template>

<script>
import Layout from '@/components/layouts/Layout.vue';

export default {
  components: {
    Layout,
  },
};
</script>

<style></style>
