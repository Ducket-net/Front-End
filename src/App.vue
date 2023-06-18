<!-- src/App.vue -->
<template>
  <div
    id="app"
    class="h-full w-full mx-auto md:rounded-lg max-w-md overflow-hidden bg-[#1A1F25] lg:mt-11 lg:max-h-[calc(100vh-80px)] lg:shadow-2xl"
  >
    <splash-screen></splash-screen>

    <transition name="fade">
      <div v-if="!showSplashScreen">
        <header class="z-50 fixed top-0 left-0 w-full bg-opacity-25">
          <div
            class="max-w-md h-[42px] mx-auto flex items-center justify-between"
          >
            <text-mask>
              <a
                href="/"
                class="flex-shrink text-white text-[14px] no-underline leading-4 flex items-center space-x-1"
                ><img src="/logo.png" class="h-[19px] w-[19px] font-lato" />
                Ducket Alpha</a
              >
            </text-mask>

            <new-room></new-room>
          </div>
        </header>

        <router-view></router-view>
      </div>
    </transition>
  </div>
</template>

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
  content: "";
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

<script>
import NewRoom from "@/components/NewRoom.vue";
import SplashScreen from "@/components/SplashScreen.vue"; // Add this line to import the SplashScreen component
import TextMask from "@/components/ui/TextMask.vue";

export default {
  components: {
    NewRoom,
    TextMask,
    SplashScreen, // Add this line to register the SplashScreen component
  },
  computed: {
    roomId() {
      return this.$store.state.roomId;
    },
    hideHeader() {
      return this.$store.state.hideHeader;
    },
    showSplashScreen() {
      return this.$store.state.showSplashScreen;
    },
    catalogItems() {
      return this.$store.state.catalog || [];
    },
  },
  methods: {},
  mounted() {},
  created() {},
};
</script>
