<!-- src/App.vue -->
<template>
  <div id="app" class="bg-gray-600 h-full w-full">
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
