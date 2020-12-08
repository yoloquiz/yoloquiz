<template>
  <div class="tooltip relative">
    <div class="tooltip__box absolute bottom-full transform left-1/2 -translate-x-1/2">
      <div class="bg-black text-white text-xs rounded py-2 px-4 right-0 bottom-full">
        {{ label }}
        <svg
          class="absolute text-black h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    label: String,
  },
};
</script>

<style lang="scss" scoped>
.tooltip {
  &__box {
    display: none;
  }
  &:hover &__box {
    display: block !important;
  }
}
</style>
