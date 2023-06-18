<template>
  <div ref="container"></div>
</template>

<script>
import * as PIXI from "pixi.js";
import { BaseFurniture, Shroom } from "@tetreum/shroom";
import { mapActions } from "vuex";

export default {
  name: "FurnitureSprite",
  props: {
    furnitureType: String, // Unique identifier of the furniture type (e.g. "club_sofa")
    direction: Number, // Direction of the animation (e.g. 2)
    animation: String, // Animation identifier (e.g. "0")
  },
  data() {
    return {
      app: null,
    };
  },
  async mounted() {
    // const application = this.pixiInstance; // Remove this unused variable
    const width = 200; // Set the desired canvas width
    const height = 200; // Set the desired canvas height

    // Set up the PixiJS application
    this.app = new PIXI.Application({
      width,
      height,
      transparent: false,
      backgroundColor: 0xff0000,
      autoDensity: true,
      resolution: window.devicePixelRatio,
    });

    // eslint-disable-next-line no-undef
    globalThis.__PIXI_APP__ = this.app;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    let shroom = Shroom.create({
      application: this.app, // Replace 'this.application' with 'this.app'
      resourcePath: "https://ducket-net.github.io/resources",
    });

    // Create and add the furniture sprite to the stage
    const furniture = BaseFurniture.fromShroom(shroom, this.app.stage, {
      direction: this.direction,
      type: { kind: "type", type: this.furnitureType },
      animation: this.animation,
    });

    furniture._onLoad = () => {
      console.log("loaded");
      console.log(furniture.dependencies.visualization.container);
      console.log(furniture.dependencies.visualization.container.width);
      console.log(furniture.dependencies.visualization.container.height);

      let furnitureContainer = furniture.dependencies.visualization.container;

      // Center the sprite considering the anchor point in the middle
      furnitureContainer.x =
        (width - furnitureContainer.width) / 2 + furnitureContainer.width / 2;
      furnitureContainer.y =
        (width - furnitureContainer.height) / 2 + furnitureContainer.height / 2;
    };

    // Add the PixiJS view (canvas) to the container
    this.$refs.container.appendChild(this.app.view);
  },
  beforeDestroy() {
    this.app.destroy(true);
  },
  async created() {
    await this.initPixiInstance();
  },
  methods: {
    ...mapActions(["initPixiInstance"]),
  },
};
</script>
