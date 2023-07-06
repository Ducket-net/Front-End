<template>
  <RenderContent
    v-if="canShowContent"
    model="page"
    :content="content"
    :api-key="apiKey"
  />
</template>

<script>
// OR use this one if you are on Vue 3
import {
  getContent,
  RenderContent,
  isPreviewing,
} from '@builder.io/sdk-vue/vue3';

export default {
  data: () => ({
    canShowContent: false,
    content: null,
    apiKey: '2cf1663ebfe04c178f9547e2f5e7eb28',
  }),
  mounted() {
    getContent({
      model: 'page',
      apiKey: '2cf1663ebfe04c178f9547e2f5e7eb28', // <-- Replace with your Public API Key
      userAttributes: {
        urlPath: window.location.pathname,
      },
    }).then((res) => {
      this.content = res;
      this.canShowContent = this.content || isPreviewing();
    });
  },
};
</script>
