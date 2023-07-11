<template>
  <div class="max-w-md relative">
    <div
      class="background-grid max-w-md left-1/2 transform -translate-x-1/2"
    ></div>
    <div class="background max-w-md left-1/2 transform -translate-x-1/2"></div>

    <div
      class="isometric-grid max-w-md fixed mx-auto bottom-0 left-0 top-0 right-0 h-screen w-screen"
      id="isometricContainer"
    >
      <div
        v-for="(tile, index) in tiles"
        :key="index"
        :class="['isometric-tile', 'no-antialias']"
        :style="{
          gridRowStart: tile.gridRowStart,
          gridColumnStart: tile.gridColumnStart,
          opacity: tile.opacity,
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const tiles = generateTiles();

    function generateTiles() {
      const windowHeight = window.innerHeight;
      const numberOfRows = Math.ceil(windowHeight / 32);
      const numberOfColumns = Math.ceil(400 / 64);
      const numberOfTiles = 300;
      const opacities = [0, 0, 1];
      let maxOpacity = 1;

      const randomTiles = Array.from({ length: numberOfTiles }, (_, i) => {
        const gridRowStart = Math.floor(i / numberOfColumns) + 1;
        const gridColumnStart = (i % numberOfColumns) + 1;
        const randomCount =
          opacities[Math.floor(Math.random() * opacities.length)];

        let opacity;
        if (randomCount > 0) {
          if (Math.random() > 0.16) {
            maxOpacity -= 0.037;
            const randomizeMaxOpacity =
              Math.random() * (maxOpacity - 0.2) + 0.3;
            opacity = randomizeMaxOpacity;
          } else {
            opacity = maxOpacity;
          }
        } else {
          opacity = 0;
        }

        return {
          gridRowStart,
          gridColumnStart,
          opacity,
        };
      });

      return randomTiles;
    }

    return {
      tiles,
    };
  },
};
</script>

<style scoped>
.isometric-grid {
  display: contents;
  display: grid;
  grid-template-rows: repeat(auto-fill, 32px);
  grid-template-columns: repeat(auto-fill, 64px);
  grid-auto-flow: dense;

  /* Restrict the maximum grid width */
}

.isometric-tile {
  width: 64px;
  height: 32px;
  position: relative;
}

.no-antialias {
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: unset;
  font-smooth: never;
}

.isometric-tile::before,
.isometric-tile::after {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.isometric-tile::before {
  bottom: 50%;
  border-width: 0 32px 16px 32px;
  border-color: transparent transparent rgba(255, 255, 255, 0.1) transparent;
  mix-blend-mode: soft-light;
}

.isometric-tile::after {
  top: 50%;
  border-width: 16px 32px 0 32px;
  border-color: rgba(255, 255, 255, 0.1) transparent transparent transparent;
  mix-blend-mode: soft-light;
}
.tile {
  position: fixed;
  width: 50px;
  height: 50px;
}

.background-grid {
  position: fixed;
  top: 0;
  mix-blend-mode: screen;
  opacity: 0.05;
  bottom: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 0;
  background-repeat: repeat;
  background-position: 38px 44px;
  background: url('../../../public/6432-grid.png');
  z-index: 2;
}

.background {
  position: fixed;
  top: 0;
  opacity: 1;
  bottom: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(140deg, #252525 0%, #191919 100%);
  z-index: 1;
}
</style>
