<template>
  <nav
    :class="{ 'top-0 absolute': fixed }"
    class="z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg"
  >
    <div class="container px-4 mx-auto flex flex-wrap items-center justify-between">
      <div class="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
        <router-link
          class="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap uppercase"
          :class="{ 'text-white': fixed, 'text-gray-900': !fixed }"
          to="/"
          >YoloQuiz</router-link
        >
        <button
          class="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
          type="button"
          v-on:click="toggleNavbar()"
        >
          <i class="fas fa-bars" :class="{ 'text-white': fixed, 'text-gray-900': !fixed }"></i>
        </button>
      </div>
      <div
        class="lg:flex flex-grow items-center bg-white lg:bg-transparent lg:shadow-none"
        v-bind:class="{ hidden: !showMenu, block: showMenu }"
      >
        <ul class="flex flex-col lg:flex-row list-none lg:ml-auto">
          <li class="flex items-center">
            <a
              class="lg:text-white lg:hover:text-gray-300 text-gray-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              target="_blank"
              rel="noopener noreferrer"
              href="https://fb.me/yolotrip.official"
              ><i class="lg:text-gray-300 text-gray-500 fab fa-facebook text-lg leading-lg "></i
              ><span class="lg:hidden inline-block ml-2">Partager</span></a
            >
          </li>
          <li v-if="isAuthenticated" class="flex items-center">
            <router-link
              class="lg:text-white lg:hover:text-gray-300 text-gray-800 px-3 py-4 lg:py-2 flex items-center text-xs uppercase font-bold"
              to="/logout"
              title="Se déconnecter"
              ><i class="lg:text-gray-300 text-gray-500 fas fa-power-off text-lg leading-lg "></i
              ><span class="lg:hidden inline-block ml-2">Se déconnecter</span></router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMenu: false,
    };
  },
  computed: mapGetters({
    isAuthenticated: 'auth/isAuthenticated',
  }),
  methods: {
    toggleNavbar() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>
