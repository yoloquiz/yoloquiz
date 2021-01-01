<template>
  <Notifications />
  <div class="min-h-screen relative">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.notify {
  z-index: 9999;
  transition: height 2s ease;
  max-width: 80%;
  @apply top-16 right-8 fixed flex flex-col-reverse items-end;

  &__item {
    @apply py-4 px-6 cursor-pointer rounded shadow text-white overflow-hidden bg-gray-500;

    &:not(:last-child) {
      @apply mt-2;
    }

    &.error {
      @apply bg-red-400;
    }
    &.success {
      @apply bg-green-500;
    }
  }
}
</style>
