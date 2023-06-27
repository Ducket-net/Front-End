<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div ref="chatContainer" class="chat-container">
      <!-- Chat bubbles will be added here -->
    </div>
    <button
      @click="addBubble()"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
    >
      Add Chat Bubble
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    addBubble() {
      const chatContainer = this.$refs.chatContainer;

      // Create a dot
      const dot = document.createElement('div');
      dot.className = 'dot bg-green-500 rounded-full w-2.5 h-2.5 absolute z-50';
      // Set the left and bottom properties using Object.assign()
      Object.assign(dot.style, {
        left: '50%',
        bottom: '100%',
        animation: 'slidein 1s forwards',
      });

      // Append the dot
      chatContainer.appendChild(dot);
      setTimeout(() => {
        // Replace the dot with a chat bubble
        const chatBubble = document.createElement('div');
        chatBubble.className =
          'chat-bubble bg-green-500 rounded px-2.5 py-3.5 text-white mb-3 mt-2.5 max-w-xs break-words relative';
        chatBubble.textContent = "I'm a chat bubble!";
        chatBubble.style.animation = 'pop 300ms forwards';
        chatBubble.style.left = '50%';
        chatBubble.style.transform = 'translateX(-50%)';

        chatContainer.replaceChild(chatBubble, dot);

        // Manually handle the scroll
        this.scrollToBottom(chatContainer);
      }, 1000);
    },
    scrollToBottom(container) {
      container.scrollTop = container.scrollHeight;
    },
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.chat-bubble:before {
  content: '';
  width: 0;
  height: 0;
  border-left: 0.625rem solid transparent;
  border-right: 0.625rem solid transparent;
  border-top: 0.625rem solid #48bb78;
  position: absolute;
  bottom: -0.625rem;
  left: 50%;
  transform: translateX(-50%);
}

@keyframes slidein {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translateY(-100%) scale(1);
  }
}

@keyframes pop {
  0% {
    transform: translateY(-100%) scale(0);
    opacity: 0;
  }
  80% {
    transform: translateY(-100%) scale(1.1);
  }
  100% {
    transform: translateY(-100%) scale();
    opacity: 1;
  }
}
</style>
