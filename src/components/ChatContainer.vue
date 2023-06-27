<template>
  <div class="flex flex-col items-start justify-end overflow-hidden h-[200px]">
    <ChatBubbleComponent
      v-for="(msg, index) in messages"
      :key="index"
      :text="msg.text"
      :image="msg.image"
      :color="msg.color"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import ChatBubbleComponent from '@/components/ChatBubble.vue';

export default {
  components: {
    ChatBubbleComponent,
  },
  data() {
    return {
      messageQueue: [],
    };
  },
  mounted() {
    // const chatContainer = this.$refs.chatContainer;
    // eslint-disable-next-line no-unused-vars
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'addMessage') {
        // eslint-disable-next-line no-unused-vars
        const { text, color } = mutation.payload;
        this.$nextTick(() => {
          //   chatContainer.scrollTo(0, chatContainer.scrollHeight);
        });
      }
    });
  },
  computed: mapState(['messages']),
  mutations: {
    // Updated addMessage() method
    async addMessage(messageText, messageColor) {
      const messageData = {
        text: messageText || 'Hello!',
        image: 'icons/frank.png',
        color: messageColor || 'red',
      };

      this.messageQueue.push(messageData);

      if (this.messageQueue.length === 1) {
        while (this.messageQueue.length > 0) {
          const nextMessage = this.messageQueue.shift();
          await this.addMessageToStore(nextMessage);
          this.scrollToBottom();
        }
      }
    },
    addMessageToStore(message) {
      return new Promise((resolve) => {
        this.$store.commit('addMessage', {
          ...message,
          onTypingComplete: () => {
            resolve();
          },
        });
      });
    },
    ...mapMutations(['addMessage']),
  },
};
</script>
