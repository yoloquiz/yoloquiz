<template>
  <footer :class="{ 'absolute w-full bottom-0 ': fixed }" class="bg-gray-900 pb-6">
    <div class="container mx-auto px-4">
      <hr class="mb-6 border-b-1 border-gray-700" />
      <div class="flex flex-wrap items-center md:justify-between justify-center">
        <div class="w-full md:w-4/12 px-4">
          <div class="text-sm text-white font-semibold py-1">
            Copyright © {{ date }}
            <a href="https://yoloquiz.skyloud.app" class="text-white hover:text-gray-400 text-sm font-semibold py-1"
              >YoloQuiz</a
            >
          </div>
        </div>
        <div class="w-full md:w-8/12 px-4">
          <ul class="flex flex-wrap list-none md:justify-end  justify-center">
            <li>
              <router-link to="/" class="text-white hover:text-gray-400 text-sm font-semibold block py-1 px-3"
                >Accueil</router-link
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: new Date().getFullYear(),
    };
  },
};
</script>
