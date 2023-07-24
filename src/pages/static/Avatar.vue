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
      <div>
        <label for="effect" class="text-white text-sm pb-1.5 block">
          Habbo Username
        </label>

        <div class="grid grid-cols-[auto,100px] gap-1">
          <input
            type="text"
            class="input-class text-black"
            v-model="username"
          />
          <!-- Country Select -->
          <select class="input-class text-black" v-model="country">
            <option id="us" value="us">COM</option>
            <option id="es" value="es">ES</option>
            <option id="fi" value="fi">FI</option>
            <option id="au" value="au">IT</option>
            <option id="au" value="au">DE</option>
          </select>
        </div>
      </div>
      <div>
        <SpecialButton
          class="w-full mt-2 text-sm bg-green-500"
          @button-click="updateAvatarLook"
          :icon="['fas', 'sync-alt']"
        >
          Update Avatar
        </SpecialButton>
      </div>
      <div>
        <label for="effect" class="text-white text-sm pb-1.5 block">
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
      room.addRoomObject(avatar);
      application.stage.addChild(room);
      loading.value = false;
    }
    function updateEffect() {
      room.removeRoomObject(avatar);
      renderAvatar(application, room);
    }

    function updateAvatarLook() {
      //Loading
      loading.value = true;
      room.removeRoomObject(avatar);
      //Get from https://api.ducket.net/habbo/{username}

      axios
        .get('https://api.ducket.net/api/habbo/' + username.value + '/')
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
