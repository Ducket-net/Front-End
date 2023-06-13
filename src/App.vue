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
          <!-- Replace the hardcoded image path with the computed property 'splashScreenImage' -->
          <img
            :src="splashScreenImage"
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
    splashScreenImage() {
      // Set the default splash screen image path
      let imagePath = "/splashscreens/apple-splash-1284-2778.png";

      // Get the device dimensions and pixel ratio
      const deviceWidth = window.innerWidth;
      const deviceHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio;

      // Define the splash screens based on width, height, and pixel ratio
      const splashScreens = [
        {
          path: "/splashscreens/apple-splash-2048-2732.png",
          width: 1024,
          height: 1366,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1668-2388.png",
          width: 834,
          height: 1194,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1536-2048.png",
          width: 768,
          height: 1024,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1668-2224.png",
          width: 834,
          height: 1112,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1620-2160.png",
          width: 810,
          height: 1080,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1290-2796.png",
          width: 430,
          height: 932,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-1179-2556.png",
          width: 393,
          height: 852,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-1284-2778.png",
          width: 428,
          height: 926,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-1284-2778.png",
          width: 428,
          height: 926,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1170-2532.png",
          width: 390,
          height: 844,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-1125-2436.png",
          width: 375,
          height: 812,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-1242-2688.png",
          width: 414,
          height: 896,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-828-1792.png",
          width: 414,
          height: 896,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-1242-2208.png",
          width: 414,
          height: 736,
          ratio: 3,
        },
        {
          path: "/splashscreens/apple-splash-750-1334.png",
          width: 375,
          height: 667,
          ratio: 2,
        },
        {
          path: "/splashscreens/apple-splash-640-1136.png",
          width: 320,
          height: 568,
          ratio: 2,
        },
      ];

      // Find the appropriate splash screen based on the device dimensions and pixel ratio
      for (const ss of splashScreens) {
        if (
          deviceWidth === ss.width &&
          deviceHeight === ss.height &&
          pixelRatio === ss.ratio
        ) {
          imagePath = ss.path;
          break;
        }
      }

      return imagePath;
    },
  },
  methods: {
    preloadImage(imagePath) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imagePath;
        img.onload = () => {
          resolve(imagePath);
        };
        img.onerror = () => {
          reject();
        };
      });
    },
    initApp() {
      // Data fetching or processing can go here, for example

      setTimeout(() => {
        this.showSplashScreen = false;
      }, 1200); // You can adjust the delay as needed
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
      this.preloadImage(this.splashScreenImage).then(() => {
        this.initApp();
      });
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
