<!-- src/App.vue -->
<template>
  <div
    id="app"
    class="w-full mx-auto sm:rounded-lg max-w-md overflow-hidden bg-[#1A1F25] sm:shadow-2xl"
  >
    <!-- <splash-screen></splash-screen>

    <transition name="fade">
      <div v-if="!showSplashScreen"> -->
    <header class="z-50 fixed top-0 left-0 w-full bg-opacity-25">
      <div class="max-w-md h-[42px] mx-auto flex items-center justify-between">
        <a
          href="/"
          class="ml-4 flex-shrink text-white text-[14px] no-underline leading-4 flex items-center space-x-1"
        >
          <img src="/logo.png" class="h-[19px] w-[19px] bg-transparent" />
          <span>Ducket Alpha</span>
        </a>

        <new-room></new-room>
      </div>
    </header>
    <div
      :style="{ backgroundColor, ...backgroundStyles }"
      id="viewport"
      class="sm:pb-4 h-screen sm:max-h-[calc(100vh-100px)] overflow-auto overflow-x-hidden no-scrollbar"
    >
      <router-view></router-view>
      <footer
        class="mt-10 mx-auto text-white my-12 text-center max-w-sm text-xs pb-7"
      >
        <div class="block py-2">
          <a
            href="https://twitter.com/wes_wim"
            target="_blank"
            class="underline text-white"
            >Twitter</a
          >
          |
          <a href="" class="underline text-white"
            >Reload <font-awesome-icon :icon="['fas', 'sync-alt']" />
          </a>
        </div>
        <p class="text-white">
          Ducket is not affiliated with, endorsed, sponsored, or specifically
          approved by Sulake Corporation Oy or its Affiliates. Ducket may use
          the trademarks and other intellectual property of Habbo, which is
          permitted under Habbo Fan Site Policy.
        </p>
      </footer>
    </div>
    <!-- </div>
    </transition> -->
  </div>
</template>

<script>
import NewRoom from '@/components/NewRoom.vue';
// import SplashScreen from '@/components/SplashScreen.vue'; // Add this line to import the SplashScreen component

export default {
  components: {
    NewRoom,
    // SplashScreen, // Add this line to register the SplashScreen component
  },
  computed: {
    loggedInUser() {
      return this.$store.state.user;
    },
    roomId() {
      return this.$store.state.roomId;
    },
    hideHeader() {
      return this.$store.state.hideHeader;
    },
    showSplashScreen() {
      return this.$store.state.showSplashScreen;
    },
    backgroundColor() {
      return this.$store.state.room.settings.bgColor;
    },
    backgroundStyles() {
      //NEED TO FIX iOS 17 BUG WITH PNGs
      let styles = {
        backgroundColor: this.backgroundColor,
      };

      if (!this.$isIOS17()) {
        styles.backgroundImage = "url('6432-grid_2.png')";
        styles.backgroundPosition = '32px 48px';
        //not Fixed background image on iOS
        styles.backgroundAttachment = 'local';
      }

      return styles;
    },
  },
  methods: {},
  mounted() {},
  created() {},
};
</script>

<style scoped>
/* Move the fade transition styles to SplashScreen.vue */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.isometric-tile::before,
.isometric-tile::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.isometric-tile::before {
  bottom: 50%;
  border-width: 0 32px 16px 32px;
  border-color: transparent transparent rgba(255, 0, 0, 0.1) transparent;
}

.isometric-tile::after {
  top: 50%;
  border-width: 16px 32px 0 32px;
  border-color: rgba(255, 255, 255, 0.1) transparent transparent transparent;
}
</style>
