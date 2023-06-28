/* eslint-disable no-unused-vars */
// src/game.js
import * as PIXI from 'pixi.js';
import {
  Room,
  Avatar,
  Shroom,
  FloorFurniture,
  loadRoomTexture,
  IConfiguration,
} from '@tetreum/shroom';
import { EventBus } from './eventBus';
import { gsap } from 'gsap';
import { isIOS17 } from './utils';

export default class Game {
  constructor(view, roomData, buildMode = false, tilemap = null) {
    this.setupPixiApp(view);
    this.shroom = this.createShroom();
    gsap.ticker.fps(120);
    this.actionLock = false;

    // Add this inside your Game class's constructor method:
    this.application.renderer.plugins.prepare.upload(
      this.shroom.container,
      () => {
        console.log('Textures prepared for rendering');
      }
    );

    //TileMap
    if (!tilemap) {
      tilemap = `xxxxx
        x0000
        x0000
        x0000
        x0000`;
    }

    this.room = this.createRoom(roomData, buildMode, tilemap);

    this.room.getDefaults = this.getDefaults.bind(this);
    this.createBackground();

    if (roomData.avatar) {
      this.avatar = this.createAvatar(roomData.avatar);
      this.room.addRoomObject(this.avatar);
    }

    this.selectedFurnitureItem = null;
  }
  setupPixiApp(view) {
    this.application = new PIXI.Application({
      view,
      antialias: false,
      resolution: 2,
      autoDensity: true,
      width: window.innerWidth,
      height: document.getElementById('canvas').clientHeight,
      transparent: false,
    });
    // eslint-disable-next-line no-undef
    globalThis.__PIXI_APP__ = this.application;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }
  createBackground() {
    // Load the texture from an image URL
    PIXI.Loader.shared.reset(); // Reset the PIXI.Loader.shared
    PIXI.Loader.shared
      .add('backgroundImage', '6432-grid_2.png')
      .load((_, resources) => {
        // Create a TilingSprite from the texture
        const background = new PIXI.TilingSprite(
          resources.backgroundImage.texture,
          this.application.screen.width,
          this.application.screen.height
        );

        // Set the size of the TilingSprite
        background.width = this.application.screen.width;
        background.height = this.application.screen.height;

        //Needed, iOS 17 does not seem to respect alpha.
        if (isIOS17()) {
          background.alpha = 0.1;
        }

        // Add the TilingSprite to the stage
        this.application.stage.addChildAt(background, 0);
      });
  }
  createShroom() {
    return Shroom.create({
      application: this.application,
      resourcePath: 'https://ducket-net.github.io/resources',
    });
  }
  onFurnitureItemClick(item) {
    if (this.selectedFurnitureItem && this.selectedFurnitureItem !== item) {
      this.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture && object !== item) {
          object.alpha = 0.5;
        }
      });
      this.alpha = 1;
      EventBus.$emit('item-unselected', this.selectedFurnitureItem);
    }

    if (this.selectedFurnitureItem === item) {
      EventBus.$emit('item-unselected', item);
      this.selectedFurnitureItem = null;
      this.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture && object !== item) {
          object.alpha = 1;
        }
      });
    } else {
      EventBus.$emit('item-selected', item);
      this.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture && object !== item) {
          object.alpha = 0.5;
        }
      });
      this.alpha = 1;
      this.selectedFurnitureItem = item;
    }
  }
  downloadRoomAsPNG(filename = 'room.png') {
    const renderTexture = PIXI.RenderTexture.create({
      width: 450,
      height: document.getElementById('canvas').clientHeight,
      resolution: this.application.renderer.resolution,
    });

    this.application.renderer.render(this.room, renderTexture);

    const extract = this.application.renderer.plugins.extract;
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

      this.application.stage.removeChild(renderTexture);
    }, 'image/png');
  }
  createRoom(roomData, buildMode, tilemap) {
    const room = Room.create(this.shroom, {
      tilemap: tilemap,
    });

    //Set width to max 400px, or if less, make centered

    // getDefaults(room);

    //Set x and y
    const defaults = this.getDefaults(room);
    room.x = defaults.x;
    room.y = defaults.y;
    this.renderItem(roomData, room, buildMode);
    room.wallColor = roomData.wallColor || '#DE6E2B';
    room.floorColor = roomData.floorColor || '#cccccc';
    room.floorTexture = loadRoomTexture('tile.png');

    return room;
  }
  getDefaults(room) {
    const containerElement = window.document.getElementById('canvasContainer');
    const containerWidth = containerElement.clientWidth;
    let y = 120;
    let x = containerWidth / 2 - room.width / 2;
    return { x, y };
  }
  createAvatar(avatarData) {
    if (avatarData) {
      return new Avatar(avatarData);
    }
  }
  renderItem(roomData, room, buildMode) {
    roomData.items.forEach((item) => {
      const furnitureItem = this.createAndSetFurnitureItem(item, buildMode);
      room.addRoomObject(furnitureItem);
    });
  }
  unselectFurniture(item) {
    if (this.selectedFurnitureItem) {
      this.onFurnitureItemClick(this.selectedFurnitureItem);
    }
  }
  updateItem(itemData) {
    if (this.selectedFurnitureItem) {
      this.room.removeRoomObject(this.selectedFurnitureItem);
      const updatedItem = this.createAndSetFurnitureItem(itemData);
      updatedItem.highlight = 1;

      this.room.addRoomObject(updatedItem);
      this.selectedFurnitureItem = updatedItem;
      this.onFurnitureItemClick(updatedItem);
    }
  }
  addItem(itemData) {
    const furnitureItem = this.createAndSetFurnitureItem(itemData, true);
    this.room.addRoomObject(furnitureItem);
    this.animateDropFurnitureItem(furnitureItem);

    EventBus.$emit('furni-added', furnitureItem);
  }
  createAndSetFurnitureItem(itemData, buildMode) {
    const furnitureItem = new FloorFurniture(itemData);

    furnitureItem.cacheAsBitmap = true;

    if (buildMode) {
      furnitureItem.onClick = (event) => {
        //Lock for 500ms
        console.log(this.actionLock);
        if (this.actionLock) {
          return;
        }
        this.actionLock = true;
        setTimeout(() => {
          this.actionLock = false;
        }, 500);
        this.animateTap(furnitureItem);
        this.onFurnitureItemClick(furnitureItem);
      };
      furnitureItem.onDoubleClick = (event) => {
        //Animaton off and on
        if (furnitureItem.animation === 1) {
          furnitureItem.animation = 0;
        } else {
          furnitureItem.animation = 1;
        }
      };
    }

    return furnitureItem;
  }
  animateDropFurnitureItem(furnitureItem) {
    const startY = 10; // starting position (shift upwards)
    const endZ = furnitureItem.roomZ; // target position

    furnitureItem.roomZ += startY; // Shift the furniture item upwards
    furnitureItem.alpha = 1; // Hide the furniture item

    const onComplete = () => {
      furnitureItem.roomZ = endZ; // Ensure the final position is reached
      furnitureItem.alpha = 1; // Ensure the final alpha value is 1
    };

    // Create the animation using gsap
    gsap
      .timeline()
      .to(furnitureItem, {
        roomZ: endZ,
        duration: 0.7,
        ease: 'bounce.out',
      })
      .to(
        furnitureItem,
        {
          alpha: 1,
          duration: 0.5,
          onComplete,
        },
        '<'
      );
  }
  animateTap(furnitureItem) {
    console.log('animateTap');
    const initialZ = furnitureItem.roomZ;
    const tappedZ = initialZ + 0.4; // Adjust the tapping factor
    const duration = 0.1; // Animation duration in seconds for each part (down and up)

    gsap
      .timeline()
      .to(furnitureItem, {
        roomZ: tappedZ,
        duration: duration,
      })
      .to(furnitureItem, {
        roomZ: initialZ,
        duration: duration,
      });
  }
  moveFurnitureItem(furnitureItem, moveX, moveY) {
    const startX = furnitureItem.roomX;
    const startY = furnitureItem.roomY;
    const endX = startX + moveX;
    const endY = startY + moveY;
    const duration = 0.4; // Reduce the duration for a snappier animation

    // Define the animation function
    const animateMove = () => {
      gsap.to(furnitureItem, {
        roomX: endX,
        roomY: endY,
        duration: duration,
        ease: 'back', // Update the easing function for a snappier animation
        onComplete: () => {
          furnitureItem.roomX = endX;
          furnitureItem.roomY = endY;
        },
      });
    };

    // Call the animateMove function
    animateMove();
  }
  floorFurnitureItemToJSON(floorFurniture) {
    return {
      type: floorFurniture.type,
      roomX: floorFurniture.roomX,
      roomY: floorFurniture.roomY,
      roomZ: floorFurniture.roomZ,
      direction: floorFurniture.direction,
      animation: floorFurniture.animation,
    };
  }
  getSerializedRoom() {
    const roomData = {
      wallColor: this.room.wallColor,
      floorColor: this.room.floorColor,
      avatar: this.avatar ? this.avatar.toJSON() : null,
      items: [],
    };

    this.room.roomObjects.forEach((object) => {
      if (object instanceof FloorFurniture) {
        roomData.items.push(this.floorFurnitureItemToJSON(object));
      }
    });

    return roomData;
  }
  addFloatingDot(furnitureItem) {
    if (!furnitureItem.floatingDot) {
      furnitureItem.alpha = 0.7;
    }
  }
  removeFloatingDot(furnitureItem) {
    furnitureItem.alpha = 1;
  }

  setBackground(bgColor) {
    let convertHex = parseInt(bgColor.slice(1), 16);
    this.application.renderer.backgroundColor = convertHex;
  }
}
