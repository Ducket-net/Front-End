<template>
  <header class="text-white text-center z-50 relative top-14">
    <h1 class="text-lg font-bold">
      <slot name="title">{{ title }}</slot>
    </h1>
    <p class="text-sm w-48 mx-auto">
      <slot name="subtitle">{{ subtitle }}</slot>
    </p>
  </header>
</template>

<script>
export default {
  name: 'Title',
  data() {
    return {};
  },
  props: {
    subtitle: {
      type: String,
      name: 'subtitle',
      default: 'Search and Discover the latest Habbo digital collectables',
    },
    title: {
      type: String,
      default: 'Collectable Catalog',
    },
  },
};
</script>
