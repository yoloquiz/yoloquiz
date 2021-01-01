<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="px-4 flex-1" :class="{ 'container mx-auto': container }">
      <section :class="classes">
        <slot />
      </section>
    </main>
    <Footer />
  </div>
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
    container: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style></style>
