<template>
  <Layout :fixed="fixed" classes="absolute w-full h-full">
    <div
      class="absolute top-0 w-full h-full bg-gray-900"
      style="background-size: 100%; background-repeat: no-repeat;"
      :style="{ 'background-image': 'url(' + require('@/assets/img/register_bg_2.png') + ')' }"
    >
      <slot />
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/layouts/Layout.vue';

export default {
  components: {
    Layout,
  },
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
