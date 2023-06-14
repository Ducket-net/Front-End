/* eslint-disable no-unused-vars */
// src/game.js
import * as PIXI from "pixi.js";
import {
  Room,
  Avatar,
  Shroom,
  FloorFurniture,
  loadRoomTexture,
  RoomCamera,
} from "@tetreum/shroom";
import { EventBus } from "./eventBus";
import { gsap } from "gsap";

export default class Game {
  constructor(view, roomData) {
    this.setupPixiApp(view);
    this.shroom = this.createShroom();
    this.room = this.createRoom(roomData);

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
      resolution: window.devicePixelRatio,
      autoDensity: true,
      width: window.innerWidth,
      height: 500,
      transparent: true,
    });
    // eslint-disable-next-line no-undef
    globalThis.__PIXI_APP__ = this.application;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

  createShroom() {
    return Shroom.create({
      application: this.application,
      resourcePath: "https://ducket-net.github.io/resources",
    });
  }

  onFurnitureItemClick(item) {
    if (this.selectedFurnitureItem) {
      this.removeFloatingDot(this.selectedFurnitureItem);
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
    }

    if (this.selectedFurnitureItem === item) {
      this.removeFloatingDot(this.selectedFurnitureItem);
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
      this.selectedFurnitureItem = null;
    } else {
      this.addFloatingDot(item);
      EventBus.$emit("item-selected", item);
      this.selectedFurnitureItem = item;
    }
  }

  createRoom(roomData) {
    const room = Room.create(this.shroom, {
      tilemap: `xxxxx
        x0000
        x0000
        x0000
        x0000`,
    });

    //Set width to max 400px, or if less, make centered

    const containerElement = window.document.getElementById("canvasContainer");
    const containerWidth = containerElement.clientWidth;
    console.log(containerWidth);
    this.renderItem(roomData, room);
    room.wallColor = roomData.wallColor || "#DE6E2B";
    room.floorColor = roomData.floorColor || "#cccccc";
    room.floorTexture = loadRoomTexture("tile.png");
    room.y = 100;
    room.x = containerWidth / 2 - room.width / 2;

    return room;
  }

  createAvatar(avatarData) {
    if (avatarData) {
      return new Avatar(avatarData);
    }
  }

  renderItem(roomData, room) {
    roomData.items.forEach((item) => {
      const furnitureItem = this.createAndSetFurnitureItem(item);
      room.addRoomObject(furnitureItem);
    });
  }

  unselectFurniture() {
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
    const furnitureItem = this.createAndSetFurnitureItem(itemData);
    this.room.addRoomObject(furnitureItem);
    this.animateDropFurnitureItem(furnitureItem);

    EventBus.$emit("furni-added", furnitureItem);
  }

  createAndSetFurnitureItem(itemData) {
    const furnitureItem = new FloorFurniture(itemData);
    furnitureItem.onClick = (event) => {
      this.animateTap(furnitureItem);
      this.onFurnitureItemClick(furnitureItem);
    };
    furnitureItem.onDoubleClick = (event) => {
      console.log("double click");
    };

    furnitureItem.onDragStart = (event) => {
      console.log("drag start");
      this.onFurnitureItemClick(furnitureItem);
      this.animateTap(furnitureItem);
    };
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
      this.application.render(this.room); // Render the final state
    };

    // Create the animation using gsap
    gsap
      .timeline()
      .to(furnitureItem, {
        roomZ: endZ,
        duration: 0.7,
        ease: "bounce.out",
        onUpdate: () => this.application.render(this.room),
      })
      .to(
        furnitureItem,
        {
          alpha: 1,
          duration: 0.5,
          onComplete,
        },
        "<"
      );
  }

  animateTap(furnitureItem) {
    const initialZ = furnitureItem.roomZ;
    const tappedZ = initialZ + 0.2; // Adjust the tapping factor
    const duration = 0.1; // Animation duration in seconds for each part (down and up)

    gsap
      .timeline()
      .to(furnitureItem, {
        roomZ: tappedZ,
        duration: duration,
        onUpdate: () => this.application.render(this.room),
      })
      .to(furnitureItem, {
        roomZ: initialZ,
        duration: duration,
        onUpdate: () => this.application.render(this.room),
      });
  }

  moveFurnitureItem(furnitureItem, moveX, moveY) {
    const startX = furnitureItem.roomX;
    const startY = furnitureItem.roomY;
    const endX = startX + moveX;
    const endY = startY + moveY;
    const duration = 0.2; // Reduce the duration for a snappier animation

    // Define the animation function
    const animateMove = () => {
      gsap.to(furnitureItem, {
        roomX: endX,
        roomY: endY,
        duration: duration,
        ease: "back", // Update the easing function for a snappier animation
        onUpdate: () => this.application.render(this.room),
        onComplete: () => {
          furnitureItem.roomX = endX;
          furnitureItem.roomY = endY;
          this.application.render(this.room);
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
}
