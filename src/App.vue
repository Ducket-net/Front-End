<!-- src/App.vue -->
<template>
  <div id="app" class="h-full w-full mx-auto md:max-w-sm md:p-1 md:rounded-lg">
    <header
      :class="{
        'bg-black': !hideHeader,
        'bg-transparent': hideHeader,
      }"
      class="h-[42px] flex items-center justify-between z-10 fixed top-0 left-0 w-full"
    >
      <a
        href="/"
        class="ml-4 flex-shrink text-white text-[14px] no-underline leading-4 flex items-center space-x-1"
      >
        <img src="/logo.png" class="h-[19px] w-[19px] font-lato" />
        <span>Ducket</span>
      </a>
      <span class="text-right text-xs text-white mr-4">Account</span>
    </header>

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
      hideHeader: false,
    };
  },
  computed: {
    catalogItems() {
      return this.$store.state.catalog || [];
    },
  },
  created() {
    this.$root.$on("hide-header", (pos) => {
      console.log("hide-header", pos);
      this.hideHeader = true;

      if (pos <= 5) {
        console.log("show-header");
        this.hideHeader = false;
      }
    });
  },
};
</script>
