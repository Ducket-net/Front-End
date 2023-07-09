<template>
  <component :is="dynamicComponent" />
</template>

<script>
import NotFound from '@/pages/static/NotFound.vue';
const staticPages = require.context('../pages/static/', true, /\.vue$/);

export default {
  computed: {
    dynamicComponent() {
      const componentName = this.$route.params.componentName;
      const componentPath = `./${componentName}.vue`;

      if (staticPages.keys().includes(componentPath)) {
        const component = staticPages(componentPath).default;
        return component;
      } else {
        return NotFound;
      }
    },
  },
};
</script>
