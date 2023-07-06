<template>
  <RenderContent
    v-if="canShowContent"
    model="page"
    :content="content"
    :api-key="apiKey"
    :customComponents="getRegisteredComponents()"
  />
</template>
<script>
// use this if you are on Vue 2
import {
  getContent,
  RenderContent,
  isPreviewing,
} from '@builder.io/sdk-vue/vue2';
// OR use this one if you are on Vue 3
import {
  getContent,
  RenderContent,
  isPreviewing,
} from '@builder.io/sdk-vue/vue3';

export default {
  components: { RenderContent },
  data: () => ({
    canShowContent: false,
    content: null,
    apiKey: '2cf1663ebfe04c178f9547e2f5e7eb28',
  }),
  mounted() {
    getContent({
      model: 'page',
      apiKey: '2cf1663ebfe04c178f9547e2f5e7eb28',
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
