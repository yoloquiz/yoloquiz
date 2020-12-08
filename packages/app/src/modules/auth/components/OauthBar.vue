<template>
  <div class="btn-wrapper text-center">
    <a
      class="bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
      :href="facebookUrl"
      style="transition: all 0.15s ease 0s;"
    >
      <img alt="Facebook" class="w-5 mr-1" src="@/assets/img/facebook.svg" />Facebook</a
    ><a
      class="bg-white active:bg-gray-100 text-gray-800 px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs"
      :href="googleUrl"
      style="transition: all 0.15s ease 0s;"
    >
      <img alt="Google" class="w-5 mr-1" src="@/assets/img/google.svg" />Google
    </a>
  </div>
</template>

<script>
import config from '@/config';

export default {
  name: 'OauthBar',
  setup() {
    return {
      facebookUrl: `${config.apiUrl}/auth/facebook`,
      googleUrl: `${config.apiUrl}/auth/google`,
    };
  },
};
</script>

<style></style>
