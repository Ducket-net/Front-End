<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script>
import { useStoryblok } from '@storyblok/vue';

export default {
  data() {
    return {
      story: null,
    };
  },
  async created() {
    this.story = await useStoryblok('home', { version: 'draft' });
  },
};
</script>
