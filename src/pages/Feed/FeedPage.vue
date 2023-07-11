<template>
  <div class="feed-page">
    <div
      v-for="feedItem in feedData"
      :key="feedItem.id"
      class="feed-item bg-white shadow-md rounded p-4 my-4"
    >
      <h3 class="text-lg font-bold mb-2">User ID: {{ feedItem.user_id }}</h3>
      <div v-for="embed in feedItem.embeds" :key="embed.url" class="embed mb-2">
        <div v-if="embed.type === 'image'">
          <img :src="embed.url" alt="Embedded Image" class="w-full rounded" />
        </div>
        <div v-else-if="embed.type === 'text'" class="text-base">
          {{ embed.content }}
        </div>
        <!-- Add more conditions for other embed types -->
      </div>
      <div class="reactions">
        <p class="font-semibold">Reactions:</p>
        <ul class="flex">
          <li
            v-for="(count, emoji) in feedItem.reactions_count"
            :key="emoji"
            class="mr-2"
          >
            {{ emoji }}: {{ count }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      feedResponse: {}, // Your JSON response
      feedData: [],
    };
  },
  async mounted() {
    let serverurl = process.env.VUE_APP_API_URL;
    try {
      const response = await axios.get(`${serverurl}/api/mocks/feed`);
      this.feedData = response.data.data;
    } catch (error) {
      console.error('Error fetching feed data:', error);
    }
  },
};
</script>
