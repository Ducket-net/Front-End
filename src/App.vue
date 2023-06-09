<!-- src/App.vue -->
<template>
  <div
    id="app"
    class="bg-gray-600 h-full w-full mx-auto md:max-w-sm md:p-1 md:rounded-lg md:mt-4"
  >
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
