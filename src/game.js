// src/game.js
import * as PIXI from "pixi.js";
import {
  Room,
  Avatar,
  Shroom,
  FloorFurniture,
  loadRoomTexture,
} from "@tetreum/shroom";
import { EventBus } from "./eventBus"; // Import the EventBus
import { gsap } from "gsap"; // Import GSAP

export default class Game {
  constructor(view, roomData) {
    this.setupPixiApp(view);
    this.shroom = this.createShroom();
    this.room = this.createRoom(roomData);

    //Optional: Create an avatar
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
      width: 384,
      height: 400,
      transparent: true,
    });
    // eslint-disable-next-line no-undef
    globalThis.__PIXI_APP__ = this.application;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

  createShroom() {
    return Shroom.create({
      application: this.application,
      // resourcePath: "/resources",
      resourcePath: "https://ducket-net.github.io/resources",
    });
  }

  onFurnitureItemClick(item) {
    // If there was a previously selected item, reset
    if (this.selectedFurnitureItem) {
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
      // this.removeOutline(this.selectedFurnitureItem);
    }

    // If the clicked item is the same as the previously selected item, reset the selectedFurnitureItem
    if (this.selectedFurnitureItem === item) {
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
      // this.removeOutline(this.selectedFurnitureItem);
      this.selectedFurnitureItem = null;
    } else {
      // Set the new selected item and update
      EventBus.$emit("item-selected", item);
      this.selectedFurnitureItem = item;
      // this.addOutline(item);
    }
  }

  createRoom(roomData) {
    const room = Room.create(this.shroom, {
      tilemap: `
        xxxxx
        x0000
        x0000
        x0000
        x0000
      `,
    });

    this.renderItem(roomData, room);
    room.wallColor = roomData.wallColor || "#DE6E2B";
    room.floorColor = roomData.floorColor || "#cccccc";
    room.floorTexture = loadRoomTexture("tile.png");
    room.y = 100;
    //50% width
    room.x = 59;
    return room; // Update this line
  }

  createAvatar(avatarData) {
    if (avatarData) {
      return new Avatar(avatarData);
    }
  }

  renderItem(roomData, room) {
    roomData.items.forEach((item) => {
      const furnitureItem = new FloorFurniture(item);
      furnitureItem.onClick = (event) => {
        console.log("Clicked on furniture item", event);
        this.animateTap(furnitureItem); // Call the animateTap function

        this.onFurnitureItemClick(furnitureItem);
      };
      room.addRoomObject(furnitureItem);
    });
  }

  unselectFurniture() {
    // If there is a selected furniture item, update and reset the selection
    if (this.selectedFurnitureItem) {
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
      this.selectedFurnitureItem.highlight = 0;
      this.selectedFurnitureItem = null;
    }
  }

  updateItem(itemData) {
    if (this.selectedFurnitureItem) {
      // Remove the current selected item from the room
      this.room.removeRoomObject(this.selectedFurnitureItem);

      // Create a new furniture item with updated properties
      const updatedItem = new FloorFurniture(itemData);

      updatedItem.highlight = 1;

      updatedItem.onClick = (event) => {
        console.log("Clicked on furniture item", event);
        this.onFurnitureItemClick(updatedItem);
      };

      // Add the new item to the room
      this.room.addRoomObject(updatedItem);

      // Update the selected item
      this.selectedFurnitureItem = updatedItem;
      this.onFurnitureItemClick(updatedItem); // This line is optional, to keep the new item selected
    }
  }
  addItem(itemData) {
    const furnitureItem = new FloorFurniture(itemData);
    furnitureItem.onClick = (event) => {
      console.log("Clicked on furniture item", event);
      this.onFurnitureItemClick(furnitureItem);
    };
    this.room.addRoomObject(furnitureItem);
    this.animateDropFurnitureItem(furnitureItem); // Call the animation function

    EventBus.$emit("furni-added", furnitureItem);
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

  floorFurnitureToJSON(floorFurniture) {
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
      // Check if the object is an instance of FloorFurniture before pushing to items
      if (object instanceof FloorFurniture) {
        roomData.items.push(this.floorFurnitureToJSON(object));
      }
    });

    return roomData;
  }
}
