<template>
  <div class="text-white h-full">
    <div v-if="isUserLoggedIn">
      <Title
        :title="`Welcome ${loggedInUser.name}!`"
        subtitle="Customize your Habbo."
      />
    </div>
    <div v-else>
      <Title title="Design your Avatar" subtitle="Customize your Habbo." />
    </div>
    <section class="mt-20 flex">
      <div class="absolute left-5 items-center justify-center">
        <div
          class="bg-black bg-opacity-50 text-center rounded-lg p-2 mt-2 items-center justify-center"
        >
          <input
            v-model="backgroundColor"
            type="color"
            class="colorPicker"
            @change="updateBackgroundColor"
          />
          <label
            for="effect"
            class="text-white text-xs block uppercase font-mono"
          >
            <font-awesome-icon icon="palette" />
            BG
          </label>
        </div>
        <div
          class="bg-black bg-opacity-50 text-center rounded-lg p-2 mt-2 items-center justify-center"
        >
          <SpecialButton
            class="w-fulltext-sm text-gray-900"
            @button-click="prepareRoomForDownload"
          >
            <font-awesome-icon icon="download" />
          </SpecialButton>
        </div>
      </div>

      <div class="absolute right-5 items-center justify-center">
        <div
          class="bg-black bg-opacity-50 text-center rounded-lg p-2 mt-2 items-center justify-center"
        >
          <input
            v-model="floorColor"
            type="color"
            class="colorPicker"
            @change="updateFloorColor"
          />
          <label
            for="effect"
            class="text-white text-xs block uppercase font-mono"
          >
            Floor
          </label>
        </div>
        <div
          class="bg-black bg-opacity-50 text-center rounded-lg p-2 mt-2 items-center justify-center"
        >
          <SpecialButton
            class="w-fulltext-sm text-white"
            @button-click="updateAvatarLook"
            :color="`bg-green-500`"
          >
            <font-awesome-icon icon="sync" />
          </SpecialButton>
        </div>
      </div>

      <div
        class="relative rounded-lg border-1 border-opacity-50 border-white border w-[150px] mx-auto overflow-hidden"
      >
        <div
          v-if="loading"
          class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-20 flex items-center justify-center"
        >
          <div class="text-white text-center">
            <div class="animate-pulse">
              <i class="fas fa-spinner fa-spin fa-2x"></i>
            </div>
            <p class="text-xs">Loading...</p>
          </div>
        </div>
        <canvas ref="gameCanvas" id="root" class="w-[150px]"></canvas>
      </div>
    </section>

    <div class="p-4 grid gap-2 bg-black m-3 rounded-lg">
      <div class="">
        <form @submit.prevent="updateAvatarLook">
          <div class="grid gap-1">
            <div>
              <label for="effect" class="text-white text-sm pb-1.5 block">
                Habbo Name
              </label>

              <div class="grid grid-cols-[1.5fr,1fr] gap-1">
                <input
                  type="text"
                  class="input-class text-black"
                  v-model="habboName"
                  required
                />
                <!-- Country Select -->
                <select class="input-class text-black" v-model="country">
                  <option id="us" value="com">English - COM</option>
                  <option id="es" value="es">Spanish - ES</option>
                  <option id="pr_br" value="com.br">Portuguese - PT/BR</option>
                  <option id="fr" value="fr">French - FR</option>
                  <option id="nl" value="nl">Dutch - NL</option>
                  <option id="fi" value="fi">Finnish - FI</option>
                  <option id="au" value="it">Italian - IT</option>
                  <option id="au" value="de">German - DE</option>
                  <option id="com_tr" value="com.tr">Turkish - TR</option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-2 gap-1">
        <div>
          <label for="effect" class="text-white text-sm pb-1.5 block">
            Effect
          </label>
          <select
            class="input-class text-black"
            v-model="effect"
            @change="updateEffect"
          >
            <option v-for="item in state.items" :key="item.id" :value="item.id">
              {{ item.lib }}
            </option>
          </select>
        </div>
        <div>
          <label for="emote" class="text-white text-sm pb-1.5 block">
            Emote
          </label>
          <select
            class="input-class text-black"
            v-model="emote"
            @change="updateEmote"
          >
            <option value="None" id="None">None</option>
            <option value="Move" id="Move">Move</option>
            <option value="Wave" id="Wave">Wave</option>
            <option value="Talk" id="Talk">Talk</option>
            <option value="Swim" id="Swim">Swim</option>
            <option value="Float" id="Float">Float</option>
            <option value="Sign" id="Sign">Sign</option>
            <option value="Respect" id="Respect">Respect</option>
            <option value="Blow" id="Blow">Blow</option>
            <option value="Laugh" id="Laugh">Laugh</option>
            <option value="Lay" id="Lay">Lay</option>
            <option value="Sit" id="Sit">Sit</option>
            <option value="Idle" id="Idle">Idle</option>
            <option value="Dance" id="Dance">Dance</option>
            <option value="UseItem" id="UseItem">UseItem</option>
            <option value="CarryItem" id="CarryItem">CarryItem</option>
            <option value="Gesture" id="Gesture">Gesture</option>
            <option value="GestureSmile" id="GestureSmile">GestureSmile</option>
            <option value="GestureSad" id="GestureSad">GestureSad</option>
            <option value="GestureAngry" id="GestureAngry">GestureAngry</option>
            <option value="GestureSurprised" id="GestureSurprised">
              GestureSurprised
            </option>
            <option value="Sleep" id="Sleep">Sleep</option>
            <option value="Default" id="Default">Default</option>
          </select>
        </div>
      </div>
      <div>
        <!-- Advanced Expander -->

        <div
          class="text-gray-500 text-sm block underline cursor-pointer"
          @click="advanced = !advanced"
        >
          Advanced
        </div>

        <div v-if="advanced">
          <label for="effect" class="text-white text-sm pb-1.5 pt-4 block">
            Habbo Look String (Override)
          </label>
          <p class="text-xs text-gray-400 pb-2">
            <a
              class="underline"
              target="_blank"
              href="http://labs.habox.org/generator-avatar"
              >Get Code from url on Habbox imager.</a
            ><br />
            Example: hd-180-1.hr-828-56.ch-255-1420.lg-281-1420.sh-295-62
          </p>
          <input
            type="text"
            class="input-class text-black"
            v-model="look"
            @change="updateAvatarLook"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GIF from 'gif.js';

import { onMounted, ref, reactive } from 'vue';
import SpecialButton from '@/components/SpecialButton.vue';
import * as PIXI from 'pixi.js';
import { Ticker } from 'pixi.js';
import xml2js from 'xml-js';
import axios from 'axios';
import Title from '@/components/ui/Title.vue';
import {
  Room,
  Avatar,
  Shroom,
  AvatarAction,
  loadRoomTexture,
} from '@tetreum/shroom';
import { hexToNumber } from '@/utils';

export default {
  name: 'Avatar',

  setup() {
    hexToNumber((hex) => {
      //Strip # if it appears
      hex = hex.replace('#', '');
      //Convert 3 digit hex to 6 digit hex
      return parseInt(hex, 16);
    });

    function updateBackgroundColor() {
      strippedColor = backgroundColor.value.replace('#', '');
      backgroundNumber = hexToNumber(strippedColor);
      application.renderer.backgroundColor = backgroundNumber;
    }

    const gameCanvas = ref(null);
    let backgroundColor = ref('#ff0088');
    let strippedColor = backgroundColor.value.replace('#', '');
    let backgroundNumber = hexToNumber(strippedColor);
    let floorColor = ref('#e6e6e6');
    let application = null;
    let advanced = ref(false);
    let habboName = ref('');
    let room = null;
    let shroom = null;
    let avatar = null;
    let loading = ref(true);
    let country = ref('com');

    const state = reactive({
      items: [{ id: 0, lib: 'None' }],
    });
    //Jump
    let effect = ref(0);
    let emote = ref('None');
    let look = ref('');
    //Watch for change of effect
    onMounted(async () => {
      application = new PIXI.Application({
        view: gameCanvas.value,
        transparent: false,
        backgroundColor: backgroundNumber,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        height: 300,
        width: 150,
      });
      globalThis.__PIXI_APP__ = application;

      shroom = Shroom.create({
        application,
        resourcePath: 'https://ducket.net/resources',
      });
      room = Room.create(shroom, {
        tilemap: `
          00
          00
        `,
      });
      room.hideWalls = true;
      room.floorColor = floorColor.value;
      room.floorTexture = loadRoomTexture('newTile.png');
      room.x = 42;
      room.y = 175;
      await fetchXMLData();
      renderAvatar(application, room);
    });
    function renderAvatar(application, room) {
      avatar = new Avatar({
        roomX: 0.5,
        roomY: 0.5,
        roomZ: 0,
        direction: 2,
        look: look.value,
      });
      avatar.effect = effect.value.toString();
      // avatar.addAction(AvatarAction.Sit);
      // avatar.addAction(AvatarAction.Lay);
      avatar.addAction(AvatarAction[emote.value]);
      room.addRoomObject(avatar);
      application.stage.addChild(room);
      loading.value = false;

      console.log(avatar);
    }
    function updateEffect() {
      room.removeRoomObject(avatar);
      renderAvatar(application, room);
    }

    function updateEmote() {
      console.log(emote.value);
      room.removeRoomObject(avatar);
      renderAvatar(application, room);
    }

    function updateFloorColor() {
      room.floorColor = floorColor.value;
    }

    async function updateAvatarLook() {
      // Loading

      if (habboName.value == '') {
        alert('Please enter a habboName.');
        return;
      }
      loading.value = true;
      room.removeRoomObject(avatar);

      try {
        const response = await axios.get(
          'https://api.ducket.net/api/habbo/' +
            habboName.value +
            '/' +
            country.value
        );
        const data = response.data;
        look = ref(data.figureString);
        renderAvatar(application, room);

        if (localStorage.getItem('access_token')) {
          try {
            const response = await axios.post(
              'https://api.ducket.net/api/keyValueStore',
              {
                key: 'avatar',
                value: data.figureString,
                sub_key: habboName.value,
              },
              {
                headers: {
                  Authorization:
                    'Bearer ' + localStorage.getItem('access_token'),
                },
              }
            );
            console.log(response);
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.error('Error fetching avatar data:', error);
      }
    }

    function prepareRoomForDownload() {
      downloadRoomAsGIF(
        'avatar.gif',
        application,
        room,
        avatar,
        backgroundNumber
      );
    }
    async function downloadRoomAsGIF(
      filename = 'avatar.gif',
      application,
      room,
      avatar,
      backgroundNumber = 0xffffff,
      numFrames = 60,
      frameDelay = 1000 / 60
    ) {
      loading.value = true;
      const gif = new GIF({
        workers: 2,
        quality: 10,
        width: 150,
        height: 250,
      });

      const ticker = avatar.animationTicker;
      let frameCount = 0;

      function captureFrame() {
        return new Promise((resolve) => {
          function tick() {
            if (frameCount < numFrames) {
              const renderTexture = PIXI.RenderTexture.create({
                width: 150,
                height: 250,
                resolution: application.renderer.resolution,
              });
              application.renderer.render(room, renderTexture);
              const extract = application.renderer.plugins.extract;
              const avatarCanvas = extract.canvas(renderTexture);

              // Create a new canvas for the background and avatar
              const finalCanvas = document.createElement('canvas');
              finalCanvas.width = 150;
              finalCanvas.height = 250;
              const ctx = finalCanvas.getContext('2d');

              // Draw the background color
              ctx.fillStyle = `#${backgroundNumber
                .toString(16)
                .padStart(6, '0')}`;
              ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);

              // Draw the avatar canvas on top of the background
              ctx.drawImage(avatarCanvas, 0, 0);

              gif.addFrame(finalCanvas, { delay: frameDelay });

              frameCount++;
            }

            if (frameCount >= numFrames) {
              resolve();
            }
          }

          const unsubscribe = ticker.subscribe(tick);
          if (frameCount >= numFrames) {
            unsubscribe();
          }
        });
      }

      //Delay 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      await captureFrame();

      gif.on('finished', (blob) => {
        // Create a temporary anchor element to trigger the download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Clean up
        URL.revokeObjectURL(link.href);
      });
      loading.value = false;
      gif.render();
    }

    const fetchXMLData = async () => {
      const response = await axios.get(
        'https://ducket.net/resources/effectmap.xml'
      );
      const data = xml2js.xml2js(response.data, { compact: true });
      // Assuming your xml file has a root element 'items' and each item has 'title' and 'description' fields.
      state.items = data.map.effect.map((item) => {
        return {
          id: item._attributes.id,
          lib: item._attributes.lib,
        };
      });
      state.items.unshift({ id: 0, lib: 'None' });
    };
    return {
      gameCanvas,
      effect,
      updateEffect,
      updateAvatarLook,
      state,
      look,
      prepareRoomForDownload,
      downloadRoomAsGIF,
      country,
      habboName,
      loading,
      emote,
      updateEmote,
      advanced,
      Title,
      backgroundColor,
      backgroundNumber,
      updateBackgroundColor,
      floorColor,
      updateFloorColor,
    };
  },
  components: { SpecialButton, Title },
};
</script>

<style scoped>
#root {
  /* Add your styles here */
}

/*------ Style 2 ------*/
.colorPicker {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-color: transparent;
  width: 42px;
  height: 60px;
  border: none;
  cursor: pointer;
}
.colorPicker::-webkit-color-swatch {
  border-radius: 5px;
  border: 2px solid #ffffff;
}
.colorPicker::-moz-color-swatch {
  border-radius: 5px;
  border: 2px solid #fffdfd;
}
</style>
