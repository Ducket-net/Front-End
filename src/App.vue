<!-- src/App.vue -->
<template>
  <div
    id="app"
    class="h-full w-full mx-auto md:p-1 md:rounded-lg max-w-md overflow-hidden"
  >
    <transition name="fade">
      <div class="splash-screen" v-if="showSplashScreen && checkIfPwa()">
        <!-- Splash Screen Image -->

        <div class="splash-screen-image">
          <img
            src="/splashscreens/apple-splash-1290-2796.png"
            class="fixed -top-12 bottom-0 left-0 right-0"
          />
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="!showSplashScreen">
        <header
          :class="{
            'bg-black': !hideHeader,
            'bg-transparent': hideHeader,
          }"
          class="h-[42px] flex items-center justify-between z-50 fixed top-0 left-0 w-full"
        >
          <a
            href="/"
            class="ml-4 flex-shrink text-white text-[14px] no-underline leading-4 flex items-center space-x-1"
          >
            <img src="/logo.png" class="h-[19px] w-[19px] font-lato" />
            <span>Ducket</span>
          </a>
          <span class="text-right text-xs text-white mr-4">Account</span>
        </header>

        <router-view></router-view>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Add the fade transition styles */
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
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.isometric-tile::before {
  bottom: 50%;
  border-width: 0 32px 16px 32px;
  border-color: transparent transparent rgba(255, 255, 255, 0.1) transparent;
}

.isometric-tile::after {
  top: 50%;
  border-width: 16px 32px 0 32px;
  border-color: rgba(255, 255, 255, 0.1) transparent transparent transparent;
}
</style>

<script>
export default {
  data() {
    return {
      roomId: "home",
      hideHeader: false,
      showSplashScreen: true,
    };
  },
  computed: {
    catalogItems() {
      return this.$store.state.catalog || [];
    },
  },
  methods: {
    initApp() {
      // Data fetching or processing can go here, for example

      setTimeout(() => {
        this.showSplashScreen = false;
      }, 2000); // You can adjust the delay as needed
    },
    checkIfPwa() {
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      ) {
        return true;
      } else {
        return false;
      }
    },
  },

  mounted() {
    this.checkIfPwa();

    if (this.checkIfPwa()) {
      this.initApp();
    } else {
      this.showSplashScreen = false;
    }
  },
  created() {
    this.$root.$on("hide-header", (pos) => {
      console.log("hide-header", pos);
      this.hideHeader = true;

      if (pos <= 5) {
        console.log("show-header");
        this.hideHeader = false;
      }
    });
  },
};
</script>
