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
      this.selectedFurnitureItem.highlight = 0;
    }

    // If the clicked item is the same as the previously selected item, reset the selectedFurnitureItem
    if (this.selectedFurnitureItem === item) {
      EventBus.$emit("item-unselected", this.selectedFurnitureItem);
      this.selectedFurnitureItem.highlight = 0;
      this.selectedFurnitureItem = null;
    } else {
      // Set the new selected item and update
      EventBus.$emit("item-selected", item);
      this.selectedFurnitureItem = item;
      item.highlight = 1;
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
    room.x = this.application.renderer.width / 4 - room.width / 2;
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
    EventBus.$emit("furni-added", furnitureItem);
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
