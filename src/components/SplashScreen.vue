<!-- src/components/SplashScreen.vue -->
<template>
  <transition name="fade">
    <div class="splash-screen" v-if="showSplashScreen">
      <div class="splash-screen-image">
        <img
          :src="splashScreenImage"
          class="fixed -top-12 bottom-0 left-0 right-0"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  computed: {
    showSplashScreen() {
      return this.$store.state.showSplashScreen;
    },
    splashScreenImage() {
      // Set the default splash screen image path
      let imagePath = '/logo.png';

      // Get the device dimensions and pixel ratio
      const deviceWidth = window.innerWidth;
      //   const deviceHeight = window.innerHeight;
      const pixelRatio = window.devicePixelRatio;

      // Define the splash screens based on width, height, and pixel ratio
      const splashScreens = [
        {
          path: '/splashscreens/apple-splash-2048-2732.png',
          width: 1024,
          height: 1366,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1668-2388.png',
          width: 834,
          height: 1194,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1536-2048.png',
          width: 768,
          height: 1024,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1668-2224.png',
          width: 834,
          height: 1112,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1620-2160.png',
          width: 810,
          height: 1080,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1290-2796.png',
          width: 430,
          height: 932,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-1179-2556.png',
          width: 393,
          height: 852,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-1284-2778.png',
          width: 428,
          height: 926,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-1284-2778.png',
          width: 428,
          height: 926,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1170-2532.png',
          width: 390,
          height: 844,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-1125-2436.png',
          width: 375,
          height: 812,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-1242-2688.png',
          width: 414,
          height: 896,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-828-1792.png',
          width: 414,
          height: 896,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-1242-2208.png',
          width: 414,
          height: 736,
          ratio: 3,
        },
        {
          path: '/splashscreens/apple-splash-750-1334.png',
          width: 375,
          height: 667,
          ratio: 2,
        },
        {
          path: '/splashscreens/apple-splash-640-1136.png',
          width: 320,
          height: 568,
          ratio: 2,
        },
      ];

      // Find the appropriate splash screen based on the device dimensions and pixel ratio
      for (const ss of splashScreens) {
        if (deviceWidth === ss.width && pixelRatio === ss.ratio) {
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
    ...mapActions(['updateShowSplashScreen']),

    initApp() {
      // Data fetching or processing can go here, for example

      setTimeout(() => {
        this.updateShowSplashScreen(false);

        if (this.$store.state.room.settings.bgColor) {
          document.body.style.backgroundColor =
            this.$store.state.room.settings.bgColor;
        }
      }, 1200); // You can adjust the delay as needed
    },
    checkIfPwa() {
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  mounted() {
    if (this.checkIfPwa()) {
      this.preloadImage(this.splashScreenImage).then(() => {
        this.initApp();
      });
    } else {
      this.updateShowSplashScreen(false);
    }
  },
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
</style>
