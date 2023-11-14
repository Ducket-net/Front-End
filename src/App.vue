<!-- src/App.vue -->
<template>
  <div id="mainApp" class="mx-auto max-w-2xl shadow-2xl overflow-hidden">
    <Tiles></Tiles>

    <div id="mainApp" class="container z-10 relative">
      <header class="header overflow-hidden">
        <header
          class="z-50 bg-black fixed top-0 left-0 w-full flex overflow-hidden"
        >
          <!-- If not on homepage, show back button -->
          <div v-if="$route.path !== '/'" class="fixed ml-4">
            <router-link to="/" class="text-gray-500 hover:text-gray-700">
              <div
                class="h-[42px] flex items-center active:border-gray-500 rounded-md text-sm"
              >
                <font-awesome-icon :icon="['fas', 'arrow-left']" /> &nbsp; Back
                to home
              </div>
            </router-link>
          </div>
          <div
            class="max-w-md h-[42px] mx-auto flex items-center justify-between"
          >
            <router-link
              to="/"
              class="flex-shrink text-white text-[14px] no-underline leading-4 flex items-center space-x-1"
            >
              <img src="/logo.png" class="h-[19px] w-[19px] bg-transparent" />
              <span>Ducket Alpha</span>
            </router-link>

            <!-- <new-room></new-room> -->
          </div>
          <div class="fixed right-4" v-if="!loggedInUser">
            <router-link to="/login" class="text-gray-500 hover:text-gray-700">
              <div
                class="h-[42px] flex items-center active:border-gray-500 rounded-md text-sm font-bold"
              >
                Login
              </div>
            </router-link>
          </div>
          <div class="fixed right-4" v-if="loggedInUser">
            <router-link to="/login" class="text-gray-500 hover:text-gray-700">
              <div
                class="h-[42px] flex items-center active:border-gray-500 rounded-md text-sm font-bold"
              >
                {{ loggedInUser.name }}
              </div>
            </router-link>
          </div>
        </header>
      </header>
      <div class="scrollable-content">
        <!-- Long content goes here -->
        <div id="viewport" class="sm:pb-4">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
          <footer
            class="mt-10 mx-auto text-white my-12 text-center max-w-sm text-xs pb-7 opacity-20"
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
              Ducket is not affiliated with, endorsed, sponsored, or
              specifically approved by Sulake Corporation Oy or its Affiliates.
              Ducket may use the trademarks and other intellectual property of
              Habbo, which is permitted under Habbo Fan Site Policy.
            </p>
          </footer>
        </div>
      </div>

      <!-- <splash-screen></splash-screen>

      

    <transition name="fade">
      <div v-if="!showSplashScreen"> -->

      <!-- </div>
    </transition> -->
    </div>
  </div>
</template>

<script>
// import NewRoom from '@/components/NewRoom.vue';
// import SplashScreen from '@/components/SplashScreen.vue'; // Add this line to import the SplashScreen component
import Tiles from '@/components/ui/Tiles.vue';

export default {
  components: {
    // NewRoom,
    // SplashScreen, // Add this line to register the SplashScreen component
    Tiles,
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

      styles.backgroundImage = "url('6432-grid_2.png')";
      styles.backgroundPosition = '32px 48px';
      //not Fixed background image on iOS
      styles.backgroundAttachment = 'local';

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
  transition: opacity 0.4s;
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(100%);
}

.slide-enter.home,
.slide-leave-to.home {
  transform: translateX(-100%);
}

.gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  background: linear-gradient(
    0deg,
    rgb(203, 189, 189) 0%,
    rgb(255, 0, 0) 25%
  ) !important;
  mix-blend-mode: overlay;
  z-index: 0;
}
</style>
