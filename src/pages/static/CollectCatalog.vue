<template>
  <main class="h-full">
    <div v-if="isUserLoggedIn">
      <Title
        :title="`Welcome ${loggedInUser.name}!`"
        subtitle="Minigames, Collectables, Homepages and more."
      />
    </div>
    <div v-else>
      <Title
        title="Welcome to Ducket"
        subtitle="Minigames, Collectables, Homepages and more."
      />
    </div>

    <section class="pointer-events-none">
      <GameRoom roomId="catalog" size="xs" />

      <!-- <details>
        <div>1,699</div>
        <div>890</div>
      </details> -->
    </section>

    <div class="grid gap-3 p-2">
      <figure class="box white" @click="twitter">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_cn2.gif" alt="Room Name" />
        <figcaption>
          <div class="flex justify-start gap-2 items-center">
            <div>👾</div>
            <div>
              Join the Waitlist
              <p class="text-xs opacity-70">
                Ducket is currently invite-only, follow for more.
              </p>
            </div>
          </div>
        </figcaption>
      </figure>

      <a href="https://api.ducket.net/home">
        <figure class="box blue">
          <div class="box-strip"></div>
          <div class="box-gradient"></div>
          <img src="/hotel-views/web_view_bg_nl.gif" alt="Room Name" />
          <figcaption>
            <div class="flex justify-start gap-2 items-center">
              <div>📊</div>
              <div>
                Rare Values
                <p class="text-xs opacity-70">Live rare values on [.com]</p>
              </div>
            </div>
          </figcaption>
        </figure>
      </a>

      <router-link to="/dashboard">
        <figure class="box red">
          <div class="box-strip"></div>
          <div class="box-gradient"></div>
          <img src="/hotel-views/web_view_bg_de.gif" alt="Room Name" />
          <figcaption>
            <div class="flex justify-start gap-2 items-center">
              <div>🏠</div>
              <div>
                Room Builder
                <p class="text-xs opacity-70">Mobile 5x5 Rooms</p>
              </div>
            </div>
          </figcaption>
        </figure>
      </router-link>
      <!-- <div class="max-wd-sm overflow-hidden">
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
      </div> -->

      <figure class="box">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_us.gif" alt="Room Name" />
        <figcaption>
          Putt Putt
          <p class="text-xs text-gray-400">Summer 2023</p>
        </figcaption>
      </figure>
      <figure class="box">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_es.gif" alt="Room Name" />
        <figcaption>
          Habbo Collectable Catalog
          <p class="text-xs text-gray-400">Beta</p>
        </figcaption>
      </figure>
      <figure class="box">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_fi.gif" alt="Room Name" />
        <figcaption>
          Historic Catalog
          <p class="text-xs text-gray-400">Beta</p>
        </figcaption>
      </figure>
      <figure class="box">
        <div class="box-strip"></div>
        <div class="box-gradient"></div>
        <img src="/hotel-views/web_view_bg_au.gif" alt="Room Name" />
        <figcaption>
          Global Fansite API
          <p class="text-xs text-gray-400">In Development</p>
        </figcaption>
      </figure>

      <div class="text-white gap-1 flex flex-col" v-if="isUserLoggedIn">
        <a href="/logout" class="bg-black block p-2 rounded-lg"> Logout</a>
      </div>
      <div class="text-white gap-1 flex flex-col" v-if="!isUserLoggedIn">
        <a href="/login" class="bg-black block p-2 rounded-lg"> Login</a>
      </div>
    </div>
  </main>
</template>

<script>
import Title from '@/components/ui/Title.vue';
import GameRoom from '@/components/GameRoom.vue';

export default {
  components: {
    Title,
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
  background: #701a95 !important;
}

.purple {
  background: #501c79 !important;
}

.red {
  background: #8b1f1f !important;
}

.blue {
  background: #27277d !important;
}

.green {
  background: #007f00 !important;
}

.box {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: #202020;
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
  bottom: 2px;
  left: 0;
  width: 100%;
  padding: 10px;
  color: white;
  font-size: 1.2rem;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.465);
}

/* Rectangle 109 */
</style>
