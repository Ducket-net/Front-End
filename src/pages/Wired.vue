<script setup>
import { ref, onMounted } from 'vue';
import { useStoryblok, StoryblokComponent } from '@storyblok/vue';

const story = ref(null);

onMounted(async () => {
  story.value = await useStoryblok('wired', { version: 'draft' });
});
</script>

<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>
