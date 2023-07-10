<template>
  <main>
    <Title
      title="Welcome to Ducket"
      subtitle="Minigames, Collectables, Homepages and more."
    />

    <section>
      <GameRoom roomId="catalog" size="xs" />
      <!-- <details>
        <div>1,699</div>
        <div>890</div>
      </details> -->
    </section>

    <div class="grid gap-2 p-2">
      <figure class="box white" @click="twitter">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_cn2.gif" alt="Room Name" />
        <figcaption>
          <div class="flex justify-start gap-2 items-center">
            <div>👾</div>
            <div>
              Join the Waitlist<br />
              <p class="text-xs text-gray-300">
                Ducket is currently invite-only, follow for more.
              </p>
            </div>
          </div>
        </figcaption>
      </figure>

      <div class="max-wd-sm overflow-hidden">
        <div class="scale-75 w-[126%] -ml-[13.5%] -my-[3rem]">
          <Tweet
            theme="dark"
            dnt="false"
            align="center"
            conversation="all"
            cards="hidden"
            tweet-url="https://twitter.com/wes_wim/status/1677913359625117696"
            >Loading...</Tweet
          >
        </div>
      </div>

      <a href="https://ducket.net?redirectToOld=true">
        <figure class="box blue">
          <div class="box-strip"></div>
          <div class="box-gradient"></div>
          <img src="/hotel-views/web_view_bg_nl.gif" alt="Room Name" />
          <figcaption>
            Rare Values
            <p class="text-xs text-gray-400">Live rare values on [.com]</p>
          </figcaption>
        </figure>
      </a>

      <figure class="box green saturate-[20%] opacity-30">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_nl.gif" alt="Room Name" />
        <figcaption>
          Putt Putt
          <p class="text-xs text-gray-400">Summer 2023</p>
        </figcaption>
      </figure>
      <figure class="box purple saturate-[20%] opacity-30">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_cn2.gif" alt="Room Name" />
        <figcaption>
          Habbo Collectable Catalog
          <p class="text-xs text-gray-400">Beta</p>
        </figcaption>
      </figure>
      <figure class="box red saturate-[20%] opacity-30">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_ca.gif" alt="Room Name" />
        <figcaption>
          Historic Catalog
          <p class="text-xs text-gray-400">Beta</p>
        </figcaption>
      </figure>
      <figure class="box blue saturate-[20%] opacity-30">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_nl.gif" alt="Room Name" />
        <figcaption>
          Global Fansite API
          <p class="text-xs text-gray-400">In Development</p>
        </figcaption>
      </figure>

      <div class="text-white gap-1 flex flex-col">
        <a
          href="https://suite.ducket.net/dashboard"
          class="bg-black block p-2 rounded-lg"
        >
          Room Builder</a
        >
      </div>
    </div>
  </main>
</template>

<script>
import Title from '@/components/ui/Title.vue';
import GameRoom from '@/components/GameRoom.vue';
import Tweet from 'vue-tweet';

export default {
  components: {
    Title,
    Tweet,
    GameRoom,
  },
  props: {},
  data() {
    return {};
  },
  methods: {
    twitter() {
      window.open('https://twitter.com/wes_wim', '_blank');
    },
  },
};
</script>

<style scoped>
/* Rectangle 111 */

@keyframes stopBounce {
  0% {
    top: 15px;
  }
  100% {
    top: 0px;
  }
}

@keyframes bounce {
  0% {
    top: 0px;
  }
}

@keyframes colorTransition {
  0% {
  }
  100% {
    background: #7f948d;
    filter: brightness(1.1);
  }
}

.box:active {
  cursor: pointer;
  transform: scale(1.01);
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border: 1px solid #000000e0;
  animation-fill-mode: both;
}

.box:active .box-gradient {
  background: linear-gradient(180deg, #ffffff34 0%, rgba(80, 28, 121, 0) 100%);
  box-shadow: inset 0px 1px 1px rgb(255, 255, 255, 0.4);
}

.white {
  background: #701a95;
}

.purple {
  background: #501c79;
}

.red {
  background: #8b1f1f;
}

.blue {
  background: #27277d;
}

.green {
  background: #007f00;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #000000;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  min-height: 70px;
}
.box-strip {
  width: 94%;
  margin: 0 auto;
  background-color: white;
  height: 2px;
  padding: 2px;
  border-radius: 50px;
  opacity: 0.05;
  position: absolute;
  top: 6px;
  left: 50%;
  transform: translateX(-50%);
}

.box-gradient {
  width: 100%;
  height: 100%;
  position: absolute;
  touch-action: pinch-zoom;
  top: 0;
  left: 0;
  box-shadow: inset 0px 1px 1px rgb(255, 255, 255, 0.33);
  border-radius: 10px;
  background: linear-gradient(180deg, #ffffff1f 0%, rgba(80, 28, 121, 0) 100%);
}

/* Rectangle 108 */

.box img {
  object-fit: none;
  object-position: 0% 50%;
  touch-action: none;
  pointer-events: none;

  -webkit-touch-callout: none;

  opacity: 1;
  mix-blend-mode: soft-light;
  filter: grayscale(100%);
}

.box figcaption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.465);
}
</style>
