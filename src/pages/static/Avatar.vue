<template>
  <div class="mt-12 text-white">
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

    <div class="p-4 grid gap-2">
      <div class="">
        <form @submit.prevent="updateAvatarLook">
          <div class="grid gap-1">
            <div>
              <label for="effect" class="text-white text-sm pb-1.5 block">
                Habbo Username
              </label>

              <div class="grid grid-cols-[auto,100px] gap-1">
                <input
                  type="text"
                  class="input-class text-black"
                  v-model="username"
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
            <div>
              <SpecialButton
                class="w-full mt-2 text-sm bg-green-500 text-white"
                :color="`bg-green-500`"
                :icon="['fas', 'sync-alt']"
              >
                Update Avatar
              </SpecialButton>
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
      <div class="border-t border-white border-1 pt-2 mt-6 border-opacity-25">
        <SpecialButton
          class="w-full mt-2 text-sm"
          @button-click="prepareRoomForDownload"
        >
          Download (PNG)
        </SpecialButton>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive } from 'vue';
import SpecialButton from '@/components/SpecialButton.vue';
import * as PIXI from 'pixi.js';
import xml2js from 'xml-js';
import axios from 'axios';
import {
  Room,
  Avatar,
  Shroom,
  BaseAvatar,
  AvatarAction,
} from '@tetreum/shroom';

export default {
  setup() {
    const gameCanvas = ref(null);
    let application = null;
    let advanced = ref(false);
    let username = ref('');
    let room = null;
    let shroom = null;
    let avatar = null;
    let loading = ref(true);
    let country = ref('us');
    const state = reactive({
      items: [{ id: 0, lib: 'None' }],
    });
    //Jump
    let effect = ref(0);
    let emote = ref('None');
    let look = ref('hd-180-1.hr-828-56.ch-255-1420.lg-281-1420.sh-295-62');
    //Watch for change of effect
    onMounted(async () => {
      application = new PIXI.Application({
        view: gameCanvas.value,
        transparent: false,
        backgroundColor: 1973790,
        resolution: window.devicePixelRatio,
        autoDensity: true,
        height: 250,
        width: 150,
      });
      shroom = Shroom.create({
        application,
        resourcePath: 'https://ducket.net/resources',
      });
      room = Room.create(shroom, {
        tilemap: `
          0
        `,
      });
      room.hideWalls = true;
      room.x = 42;
      room.y = 175;
      await fetchXMLData();
      renderAvatar(application, room);
    });
    function renderAvatar(application, room) {
      avatar = new Avatar({
        roomX: 0,
        roomY: 0,
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

    function updateAvatarLook() {
      //Loading
      loading.value = true;
      room.removeRoomObject(avatar);
      //Get from https://api.ducket.net/habbo/{username}

      axios
        .get(
          'https://api.ducket.net/api/habbo/' +
            username.value +
            '/' +
            country.value
        )
        .then((response) => {
          const data = response.data;
          look = ref(data.figureString);
          renderAvatar(application, room);
        });
    }

    function prepareRoomForDownload() {
      downloadRoomAsPNG('avatar.png', application, room);
    }
    function downloadRoomAsPNG(filename = 'room.png', application, room) {
      const renderTexture = PIXI.RenderTexture.create({
        width: 150,
        height: 250,
        resolution: application.renderer.resolution,
      });
      application.renderer.render(room, renderTexture);
      const extract = application.renderer.plugins.extract;
      const canvas = extract.canvas(renderTexture);
      canvas.toBlob((blob) => {
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
        application.stage.removeChild(renderTexture);
      }, 'image/png');
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
      downloadRoomAsPNG,
      country,
      username,
      loading,
      emote,
      updateEmote,
      advanced,
    };
  },
  components: { SpecialButton },
};
</script>

<style scoped>
#root {
  /* Add your styles here */
}
</style>
