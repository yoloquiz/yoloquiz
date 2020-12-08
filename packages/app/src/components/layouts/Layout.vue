<template>
  <Navbar :fixed="fixed" />
  <main :class="{ 'container mx-auto': container }">
    <section :class="classes">
      <slot />
    </section>
  </main>
  <Footer :fixed="true" />
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer,
  },
  props: {
    classes: String,
    fixed: {
      type: Boolean,
      default: false,
    },
    container: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
