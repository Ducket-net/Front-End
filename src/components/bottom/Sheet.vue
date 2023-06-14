<template>
  <div
    :class="[
      'bottom-sheet',
      {
        opened: opened,
        closed: opened === false,
        moving: moving,
      },
    ]"
    v-on="handlers"
    ref="bottomSheet"
    :style="{
      'pointer-events':
        backgroundClickable && clickToClose == false ? 'none' : 'all',
    }"
  >
    <div
      v-if="overlay"
      class="bottom-sheet__backdrop"
      :style="{ background: overlayColor }"
    />
    <div
      :style="[
        { bottom: cardP + 'px', maxWidth: maxWidth, maxHeight: maxHeight },
        { height: isFullScreen ? '100%' : 'auto' },
        { 'pointer-events': 'all' },
      ]"
      :class="[
        'bottom-sheet__card',
        { stripe: stripe, square: !rounded },
        effect,
        { 'fx-card-animation': effect === 'fx-card-animation' },
      ]"
      ref="bottomSheetCard"
    >
      <div class="bottom-sheet__pan" ref="pan">
        <div class="bottom-sheet__bar" />
      </div>
      <div
        :style="{ height: contentH }"
        ref="bottomSheetCardContent"
        class="bottom-sheet__content"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import Hammer from "hammerjs";

export default {
  name: "VueBottomSheet",
  data() {
    const vm = this;
    return {
      inited: false,
      opened: false,
      contentH: "auto",
      hammer: {
        pan: null,
        content: null,
      },
      contentScroll: 0,
      cardP: null,
      cardH: null,
      moving: false,
      stripe: 0,
      handlers: {
        mousedown: vm.clickOnBottomSheet,
        touchstart: vm.clickOnBottomSheet,
      },
    };
  },
  props: {
    overlay: {
      type: Boolean,
      default: true,
    },
    maxWidth: {
      type: String,
      default: "640px",
    },
    maxHeight: {
      type: String,
      default: "95%",
    },
    clickToClose: {
      type: Boolean,
      default: true,
    },
    effect: {
      type: String,
      default: "fx-card-animation",
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    swipeAble: {
      type: Boolean,
      default: true,
    },
    isFullScreen: {
      type: Boolean,
      default: false,
    },
    overlayColor: {
      type: String,
      default: "#0000004D",
    },
    backgroundScrollable: {
      type: Boolean,
      default: false,
    },
    backgroundClickable: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    isIphone() {
      let iPhone = /iPhone/.test(navigator.userAgent) && !window.MSStream;
      let aspect = window.screen.width / window.screen.height;
      return iPhone && aspect.toFixed(3) === "0.462";
    },
    move(event, type) {
      if (this.swipeAble) {
        let delta = -event.deltaY;
        if (
          (type === "content" && event.type === "panup") ||
          (type === "content" &&
            event.type === "pandown" &&
            this.contentScroll > 0)
        ) {
          this.$refs.bottomSheetCardContent.scrollTop =
            this.contentScroll + delta;
        } else if (event.type === "panup" || event.type === "pandown") {
          this.moving = true;
          if (event.deltaY > 0) {
            this.cardP = delta;
          }
        }
        if (event.isFinal) {
          this.contentScroll = this.$refs.bottomSheetCardContent.scrollTop;
          this.moving = false;
          if (this.cardP < -30) {
            this.opened = false;
            this.cardP = -this.cardH - this.stripe;
            document.body.style.overflow = "";
            this.$emit("closed");
          } else {
            this.cardP = 0;
          }
        }
      }
    },
    init() {
      return new Promise((resolve) => {
        this.contentH = "auto";
        this.stripe = this.isIphone() ? 20 : 0;
        this.cardH = this.$refs.bottomSheetCard.clientHeight;
        this.contentH = `${this.cardH - this.$refs.pan.clientHeight}px`;
        this.$refs.bottomSheetCard.style.maxHeight = this.maxHeight;
        this.cardP =
          this.effect === "fx-slide-from-right" ||
          this.effect === "fx-slide-from-left"
            ? 0
            : -this.cardH - this.stripe;
        if (!this.inited) {
          this.inited = true;
          let options = {
            recognizers: [
              [Hammer.Pan, { direction: Hammer.DIRECTION_VERTICAL }],
            ],
          };
          this.hammer.pan = new Hammer(this.$refs.pan, options);
          this.hammer.pan.on("panstart panup pandown panend", (e) => {
            this.move(e, "pan");
          });
          this.hammer.content = new Hammer(
            this.$refs.bottomSheetCardContent,
            options
          );
          this.hammer.content.on("panstart panup pandown panend", (e) => {
            this.move(e, "content");
          });
        }
        setTimeout(() => {
          resolve();
        }, 10);
      });
    },
    open() {
      this.init().then(() => {
        this.opened = true;
        this.cardP = 0;

        if (!this.$props.backgroundScrollable) {
          document.body.style.overflow = "hidden";
        }

        this.$emit("opened");
      });
    },
    close() {
      this.opened = false;
      this.cardP =
        this.effect === "fx-slide-from-right" ||
        this.effect === "fx-slide-from-left"
          ? 0
          : -this.cardH - this.stripe;
      document.body.style.overflow = "";
      this.$emit("closed");
    },
    clickOnBottomSheet(event) {
      if (this.clickToClose) {
        if (
          event.target.classList.contains("bottom-sheet__backdrop") ||
          event.target.classList.contains("bottom-sheet")
        ) {
          this.close();
        }
      }
    },
  },
  beforeDestroy() {
    this.hammer?.pan?.destroy();
    this.hammer?.content?.destroy();
  },
  beforeCreate() {
    // this.opened = false;
  },
};
</script>

<style lang="scss" scoped>
@keyframes bounce-in-up {
  0%,
  20%,
  50%,
  80%,
  100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translateY(3000px);
  }
  60% {
    opacity: 1;
    transform: translateY(-20px);
  }
  75% {
    opacity: 1;
    transform: translateY(10px);
  }
  90% {
    opacity: 1;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fx-card-animation {
  background: linear-gradient(180deg, #495864 0%, #161c21 85.42%) !important;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2),
    inset 0px 1px 0px rgba(255, 255, 255, 0.19) !important;
  animation: bounce-in-up 0.6s !important;
}
.bottom-sheet {
  z-index: 99999;
  transition: all 0.4s ease;
  position: relative;

  * {
    box-sizing: border-box;
  }

  &__content {
    overflow-y: scroll;
  }

  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    opacity: 0;
    visibility: hidden;
  }

  &__card {
    width: 100%;

    position: fixed;
    background: white;
    border-radius: 14px 14px 0 0;
    // left: 50%;
    z-index: 9999;
    margin: 0 auto;

    &.square {
      border-radius: 0;
    }

    &.stripe {
      padding-bottom: 20px;
    }

    // &.fx-default {
    //   transform: translate(-50%, 0);
    //   transition: bottom 0.3s ease;
    // }
  }

  &__pan {
    padding-bottom: 20px;
    padding-top: 15px;
    height: 38px;
  }

  &__bar {
    display: block;
    width: 50px;
    height: 3px;
    border-radius: 14px;
    margin: 0 auto;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
  }

  &.opened {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
