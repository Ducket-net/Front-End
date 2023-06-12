<!-- src/App.vue -->
<template>
  <div id="app" class="h-full w-full mx-auto md:max-w-sm md:p-1 md:rounded-lg">
    <header
      class="bg-black h-[42px] flex items-center justify-center z-10 fixed top-0 left-0 w-full"
    >
      <a href="/" class="flex text-white text-[14px] no-underline leading-4"
        ><img
          src="/logo.png"
          class="flex-shrink h-[19px] w-[19px] font-lato"
        />Ducket</a
      >
    </header>
    <div class="isometric-tile w-[64px] h-[32px] fixed top-16 left-10"></div>
    <div class="isometric-tile w-[64px] h-[32px] fixed top-16 left-64"></div>
    <div class="isometric-tile w-[64px] h-[32px] fixed top-16 left-32"></div>
    <div class="isometric-tile w-[64px] h-[32px] fixed top-8 left-10"></div>

    <router-view></router-view>
  </div>
</template>

<style scoped>
.isometric-tile::before,
.isometric-tile::after {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.isometric-tile::before {
  bottom: 50%;
  border-width: 0 32px 16px 32px;
  border-color: transparent transparent rgba(255, 255, 255, 0.1) transparent;
}

.isometric-tile::after {
  top: 50%;
  border-width: 16px 32px 0 32px;
  border-color: rgba(255, 255, 255, 0.1) transparent transparent transparent;
}
</style>

<script>
export default {
  data() {
    return {
      roomId: "home",
    };
  },
  computed: {
    catalogItems() {
      return this.$store.state.catalog || [];
    },
  },
};
</script>
