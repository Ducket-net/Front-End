<!-- src/App.vue -->
<template>
  <div id="app" class="h-full w-full mx-auto md:max-w-sm md:p-1 md:rounded-lg">
    <router-view></router-view>
  </div>
</template>

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
