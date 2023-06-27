<template>
  <transition name="slide-fade">
    <div class="p-1" v-if="show">
      <div
        :class="[
          ' bg-gradient-to-bl shadow-xl relative rounded-full p-[3px] grid grid-cols-[auto,auto] max-w-xs mx-auto text-sm',
          ...bubbleClasses,
        ]"
      >
        <div
          class="bg-gray-300 rounded-l-full border-2 border-gray-300 flex items-baseline"
        >
          <div
            class="bg-white h-6 w-6 rounded-full m-auto overflow-hidden border-2 border-white"
          >
            <img :src="image" class="object-none" alt="User avatar" />
          </div>
        </div>
        <div
          class="bg-white rounded-r-full text-sm px-2 pr-3 p-1 flex items-baseline"
          ref="messageText"
        >
          <div class="relative flex h-2 w-2 m-auto">
            <div
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"
            ></div>
            <div
              class="relative inline-flex rounded-full h-2 w-2 bg-gray-400"
            ></div>
          </div>
          <div class="hidden">{{ text }}</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'red',
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    bubbleClasses() {
      const gradientColors = {
        red: ' from-red-400 to-red-800',
        blue: ' from-blue-400 to-blue-800',
        green: ' from-green-400 to-green-800',
        purple: ' from-purple-400 to-purple-800',
        yellow: ' from-yellow-400 to-yellow-800',
      };

      return (
        gradientColors[this.color]?.split(' ') || gradientColors.red.split(' ')
      );
    },
  },
  mounted() {
    this.show = true;
    setTimeout(() => {
      this.$refs.messageText.classList.add('hidden');

      this.animateText().then(() => {
        this.$emit('onTypingComplete');
      });
    }, 1000);
  },
  mutations: {
    addMessage(state, payload) {
      state.messages.push(payload);
      if (payload.onTypingComplete) {
        state.messages[state.messages.length - 1].onTypingComplete =
          payload.onTypingComplete;
      }
    },
  },
  methods: {
    animateText() {
      return new Promise((resolve) => {
        const messageText = this.$refs.messageText;
        const text = this.text;

        messageText.innerText = '';
        messageText.classList.remove('hidden');

        let idx = 0;

        const typeWriter = () => {
          if (idx < text.length) {
            messageText.innerHTML += text.charAt(idx);
            idx++;

            let typingSpeed;

            if (idx < 3) {
              typingSpeed = 20;
            } else {
              typingSpeed = 50;
            }

            setTimeout(typeWriter, typingSpeed);
          } else {
            resolve();
          }
        };

        typeWriter();
      });
    },
  },
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
