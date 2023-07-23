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
  constructor(
    view,
    roomData,
    buildMode = false,
    tilemap = null,
    smallRoom = false
  ) {
    this.setupPixiApp(view);
    this.shroom = this.createShroom();
    gsap.ticker.fps(120);
    this.actionLock = false;
    this.smallRoom = smallRoom;

    // Add this inside your Game class's constructor method:
    this.application.renderer.plugins.prepare.upload(
      this.shroom.container,
      () => {
        console.log('Textures prepared for rendering');
      }
    );

    //TileMap
    if (!tilemap) {
      tilemap = `
      xxxxx
      x0000
      x0000
      x0000
      x0000`;
    }

    this.room = this.createRoom(roomData, buildMode, tilemap, smallRoom);

    this.room.getDefaults = this.getDefaults.bind(this);
    // this.createBackground();
    this.createFlag();

    if (roomData.avatar) {
      this.avatar = this.createAvatar(roomData.avatar);
      this.room.addRoomObject(this.avatar);
    }

    this.selectedFurnitureItem = null;
  }
  setupPixiApp(view) {
    const canvasContainer = document.getElementById('mainApp');
    const canvasWidth = canvasContainer.clientWidth;
    this.application = new PIXI.Application({
      view,
      antialias: false,
      resolution: 4,
      autoDensity: true,
      width: canvasWidth,
      height: document.getElementById('canvas').clientHeight,
      transparent: true,
    });
    // eslint-disable-next-line no-undef
    globalThis.__PIXI_APP__ = this.application;
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
  }

  createFlag() {
    // // Load the texture from an image URL
    // PIXI.Loader.shared.reset(); // Reset the PIXI.Loader.shared
    // PIXI.Loader.shared
    //   .add('flagImage', 'flags/Danishflag.png')
    //   .load((_, resources) => {
    //     // Create a TilingSprite from the texture
    //     const flag = new PIXI.Sprite(resources.flagImage.texture, 32, 64);
    //     flag.scale.x = 1;
    //     flag.x = 100;
    //     flag.y = 100;
    //     // Add the TilingSprite to the stage
    //     this.application.stage.addChildAt(flag, 1);
    //   });
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
      resourcePath: 'https://ducket.net/resources',
    });
  }
  onFurnitureItemClick(item) {
    // if (this.selectedFurnitureItem && this.selectedFurnitureItem !== item) {
    //   EventBus.emit('item-unselected', this.selectedFurnitureItem);
    // }

    if (this.selectedFurnitureItem === item) {
      EventBus.emit('item-unselected', item);
      this.selectedFurnitureItem = null;
      this.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture && object !== item) {
          // object.alpha = 1;
        }
      });
    } else {
      EventBus.emit('item-selected', item);
      this.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture && object !== item) {
          // object.alpha = 0.5;
        }
      });
      // this.alpha = 1;
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
  createRoom(roomData, buildMode, tilemap, smallRoom) {
    const room = Room.create(this.shroom, {
      tilemap: tilemap,
    });

    room.smallRoom = true;

    if (smallRoom) {
      room.wallHeight = 60;
      room.wallDepth = 4;
      room.tileHeight = 4;
      room.tileDepth = 4;
    }

    //Set x and y
    const defaults = this.getDefaults(room);
    room.x = defaults.x;
    room.y = defaults.y;
    this.renderItem(roomData, room, buildMode);
    room.wallColor = roomData.wallColor || '#DE6E2B';
    room.floorColor = roomData.floorColor || '#cccccc';

    if (smallRoom) {
      room.floorTexture = loadRoomTexture('tile_32.png');
      room.wallTexture = loadRoomTexture('wallpaper.png');
    } else {
      room.floorTexture = loadRoomTexture('tile.png');
    }

    return room;
  }
  getDefaults(room) {
    const containerElement = window.document.getElementById('app');
    let containerWidth = containerElement.clientWidth;
    let roomWidth = room.width * window.devicePixelRatio;
    containerWidth = containerWidth * window.devicePixelRatio;

    console.log(containerWidth);
    console.log(room.width);

    //Room width to device pixel ratio

    let x;
    let y;

    if (this.smallRoom) {
      y = 180;
      x = (452 - roomWidth) / 2 + roomWidth / 2 - 32;
    } else {
      y = 212;
      x = (452 - roomWidth) / 2 + roomWidth / 2 - 40;
    }
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
  updateItem(itemData, direction) {
    if (this.selectedFurnitureItem) {
      this.room.removeRoomObject(this.selectedFurnitureItem);
      const updatedItem = this.createAndSetFurnitureItem(itemData);

      updatedItem.direction = direction;

      updatedItem.onClick = (event) => {
        //Lock for 500ms
        if (this.actionLock) {
          return;
        }
        this.actionLock = true;
        setTimeout(() => {
          this.actionLock = false;
        }, 500);
        this.animateTap(updatedItem);

        this.onFurnitureItemClick(updatedItem);
      };

      this.room.addRoomObject(updatedItem);
      this.selectedFurnitureItem = updatedItem;
      this.onFurnitureItemClick(updatedItem);
    }
  }
  addItem(itemData) {
    const furnitureItem = this.createAndSetFurnitureItem(itemData, true);
    this.room.addRoomObject(furnitureItem);
    this.animateDropFurnitureItem(furnitureItem);

    EventBus.emit('furni-added', furnitureItem);
  }

  createAndSetFurnitureItem(itemData, buildMode) {
    //Set window tempfurnisite + type to 32

    if (itemData.type === 'duck') {
      //Insert PNG to room pixijs
    }

    if (this.smallRoom) {
      window['_tempFurniSize'] = 32;
      window['_tempFurniSizeUses'] = 0;
    }

    const furnitureItem = new FloorFurniture(itemData);

    furnitureItem.cacheAsBitmap = true;

    if (buildMode) {
      furnitureItem.onClick = (event) => {
        //Lock for 500ms
        if (this.actionLock) {
          return;
        }
        this.actionLock = true;
        setTimeout(() => {
          this.actionLock = false;
        }, 500);
        this.animateTap(furnitureItem);

        setTimeout(() => {
          this.onFurnitureItemClick(furnitureItem);
        }, 100);
      };
    }

    return furnitureItem;
  }
  animateDropFurnitureItem(furnitureItem) {
    const startY = 10; // starting position (shift upwards)
    const endZ = furnitureItem.roomZ; // target position

    furnitureItem.roomZ += startY; // Shift the furniture item upwards
    // furnitureItem.alpha = 1; // Hide the furniture item

    const onComplete = () => {
      furnitureItem.roomZ = endZ; // Ensure the final position is reached
      // furnitureItem.alpha = 1; // Ensure the final alpha value is 1
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
    if (this.smallRoom) {
      moveX = moveX / 2;
      moveY = moveY / 2;
    }

    const startX = furnitureItem.roomX;
    const startY = furnitureItem.roomY;
    let endX = startX + moveX;
    let endY = startY + moveY;
    //Floor X and Y to 1 decimals
    endX = Math.floor(endX * 100) / 100;
    endY = Math.floor(endY * 100) / 100;

    const duration = 0.2; // Reduce the duration for a snappier animation

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
      // furnitureItem.alpha = 0.7;
    }
  }
  removeFloatingDot(furnitureItem) {
    // furnitureItem.alpha = 1;
  }

  setBackground(bgColor) {
    let convertHex = parseInt(bgColor.slice(1), 16);
    this.application.renderer.backgroundColor = convertHex;
  }
}

/* eslint-disable no-unused-vars */
// // src/game.js
// import * as PIXI from 'pixi.js';
// import {
//   Avatar,
//   Shroom,
//   loadRoomTexture,
//   IConfiguration,
//   FloorFurniture,
//   Room as ShroomRoom,
// } from '@tetreum/shroom';
// import { EventBus } from './eventBus';
// import { gsap } from 'gsap';
// import { isIOS17 } from './utils';

// // BaseRoom class
// class BaseRoom {
//   constructor(roomData, buildMode, tilemap) {
//     this.roomData = roomData;
//     this.buildMode = buildMode;
//     this.tilemap = tilemap;
//   }
//   get roomObjects() {
//     return this.room.roomObjects;
//   }

//   getDefaults() {
//     const containerElement = window.document.getElementById('app');
//     const containerWidth = containerElement.clientWidth;

//     console.log(containerWidth);

//     let x;
//     let y;

//     if (this.smallRoom) {
//       y = 210;
//       x = 300 - this.room.width + 32;
//     } else {
//       y = 210;
//       x = containerWidth - 200 + 32;
//     }
//     return { x, y };
//   }

//   setBackground(bgColor) {
//     let convertHex = parseInt(bgColor.slice(1), 16);
//     this.room.room.application.renderer.backgroundColor = convertHex;
//   }

//   removeRoomObject(roomObject) {
//     this.room.removeRoomObject(roomObject);
//   }

//   addItem(itemData) {
//     const furnitureItem = this.createAndSetFurnitureItem(itemData, true);
//     this.room.addRoomObject(furnitureItem);
//     Animation.animateDropFurnitureItem(furnitureItem);

//     EventBus.$emit('furni-added', furnitureItem);
//   }
//   createAndSetFurnitureItem(itemData, buildMode) {
//     //Set window tempfurnisite + type to 32

//     if (this.smallRoom) {
//       window['_tempFurniSize'] = 32;
//       window['_tempFurniSizeUses'] = 0;
//     }

//     const furnitureItem = new FloorFurniture(itemData);

//     furnitureItem.cacheAsBitmap = true;

//     if (buildMode) {
//       furnitureItem.onClick = (event) => {
//         //Lock for 500ms
//         console.log(this.actionLock);
//         if (this.actionLock) {
//           return;
//         }
//         this.actionLock = true;
//         setTimeout(() => {
//           this.actionLock = false;
//         }, 500);
//         this.animateTap(furnitureItem);
//         this.onFurnitureItemClick(furnitureItem);
//       };
//       furnitureItem.onDoubleClick = (event) => {
//         //Animaton off and on
//         if (furnitureItem.animation === 1) {
//           furnitureItem.animation = 0;
//         } else {
//           furnitureItem.animation = 1;
//         }
//       };
//     }

//     return furnitureItem;
//   }

//   // Additional methods or properties common to both classes...
// }

// // Room class
// class Room extends BaseRoom {
//   constructor(roomData, buildMode, tilemap, shroom) {
//     super(roomData, buildMode, tilemap);
//     this.roomType = 'regular';
//     this.shroom = shroom;
//     this.room = this.createRoom(roomData, buildMode, tilemap);
//   }

//   createRoom(roomData, buildMode, tilemap) {
//     // Add the logic for creating a regular room, using
//     // the properties and methods from the BaseRoom class
//     const room = ShroomRoom.create(this.shroom, { tilemap: tilemap });

//     // Get the default x and y coordinates
//     const defaults = this.getDefaults(room);
//     room.x = defaults.x;
//     room.y = defaults.y;

//     // Configure regular room properties
//     room.wallColor = roomData.wallColor || '#DE6E2B';
//     room.floorColor = roomData.floorColor || '#cccccc';
//     room.floorTexture = loadRoomTexture('tile.png');

//     // Add items to the room
//     roomData.items.forEach((item) => {
//       const furnitureItem = new Furniture(item, buildMode);
//       room.addRoomObject(furnitureItem);
//     });

//     // Add avatar to the room
//     if (roomData.avatar) {
//       this.avatar = AvatarWrapper.createAvatar(roomData.avatar);
//       this.room.addRoomObject(this.avatar);
//     }

//     return room;
//   }
// }

// // SmallRoom class
// class SmallRoom extends BaseRoom {
//   constructor(roomData, buildMode, tilemap, shroom) {
//     super(roomData, buildMode, tilemap);
//     this.roomType = 'small';
//     this.shroom = shroom;
//     this.room = this.createSmallRoom(roomData, buildMode, tilemap);
//   }

//   createSmallRoom(roomData, buildMode, tilemap) {
//     const room = ShroomRoom.create(this.shroom, { tilemap: tilemap });

//     // Get the default x and y coordinates
//     const defaults = this.getDefaults(room);
//     room.x = defaults.x;
//     room.y = defaults.y;

//     // Configure small room properties
//     room.wallHeight = 60;
//     room.wallDepth = 4;
//     room.tileHeight = 4;
//     room.tileDepth = 4;

//     room.wallColor = roomData.wallColor || '#DE6E2B';
//     room.floorColor = roomData.floorColor || '#cccccc';
//     room.floorTexture = loadRoomTexture('tile_32.png');

//     // Add items to the small room
//     roomData.items.forEach((item) => {
//       const furnitureItem = new Furniture(item, buildMode);
//       room.addRoomObject(furnitureItem);
//     });

//     // Add avatar to the small room
//     if (roomData.avatar) {
//       const avatar = new AvatarWrapper(roomData.avatar);
//       room.addRoomObject(avatar);
//     }

//     return room;
//   }

//   // Additional methods or properties specific to a small room...
// }
// // Furniture class
// class Furniture extends FloorFurniture {
//   constructor(itemData, buildMode) {
//     super(itemData);
//     this.isSelected = false;
//     this.setupClickEvents(buildMode);
//   }

//   setupClickEvents(buildMode) {
//     if (buildMode) {
//       this.onClick = (event) => {
//         if (this.isSelected) {
//           EventBus.$emit('item-unselected', this);
//         } else {
//           EventBus.$emit('item-selected', this);
//         }
//         this.isSelected = !this.isSelected;
//       };
//     }
//   }

//   // Additional properties and methods specific to furniture items...
// }

// // AvatarWrapper class
// class AvatarWrapper extends Avatar {
//   constructor(avatarData) {
//     super(avatarData);
//   }

//   static createAvatar(avatarData) {
//     if (avatarData) {
//       return new AvatarWrapper(avatarData);
//     }
//     return null;
//   }

//   // Additional properties and methods specific to avatars...
// }
// // Animation class
// class Animation {
//   static animateDropFurnitureItem(furnitureItem) {
//     const startY = 10; // starting position (shift upwards)
//     const endZ = furnitureItem.roomZ; // target position

//     furnitureItem.roomZ += startY; // Shift the furniture item upwards
//     furnitureItem.alpha = 1; // Hide the furniture item

//     const onComplete = () => {
//       furnitureItem.roomZ = endZ; // Ensure the final position is reached
//       furnitureItem.alpha = 1; // Ensure the final alpha value is 1
//     };

//     // Create the animation using gsap
//     gsap
//       .timeline()
//       .to(furnitureItem, {
//         roomZ: endZ,
//         duration: 0.7,
//         ease: 'bounce.out',
//       })
//       .to(
//         furnitureItem,
//         {
//           alpha: 1,
//           duration: 0.5,
//           onComplete,
//         },
//         '<'
//       );
//   }

//   static animateTap(furnitureItem) {
//     const initialZ = furnitureItem.roomZ;
//     const tappedZ = initialZ + 0.4; // Adjust the tapping factor
//     const duration = 0.1; // Animation duration in seconds for each part (down and up)

//     gsap
//       .timeline()
//       .to(furnitureItem, {
//         roomZ: tappedZ,
//         duration: duration,
//       })
//       .to(furnitureItem, {
//         roomZ: initialZ,
//         duration: duration,
//       });
//   }

//   static moveFurnitureItem(furnitureItem, moveX, moveY) {
//     const startX = furnitureItem.roomX;
//     const startY = furnitureItem.roomY;
//     const endX = startX + moveX;
//     const endY = startY + moveY;
//     const duration = 0.4; // Reduce the duration for a snappier animation

//     // Define the animation function
//     const animateMove = () => {
//       gsap.to(furnitureItem, {
//         roomX: endX,
//         roomY: endY,
//         duration: duration,
//         ease: 'back', // Update the easing function for a snappier animation
//         onComplete: () => {
//           furnitureItem.roomX = endX;
//           furnitureItem.roomY = endY;
//         },
//       });
//     };

//     // Call the animateMove function
//     animateMove();
//   }

//   // Additional properties and methods specific to animations...
// }

// // Utils class
// class Utils {
//   static downloadRoomAsPNG(application, room, filename = 'room.png') {
//     const renderTexture = PIXI.RenderTexture.create({
//       width: 450,
//       height: document.getElementById('canvas').clientHeight,
//       resolution: application.renderer.resolution,
//     });

//     application.renderer.render(room, renderTexture);

//     const extract = application.renderer.plugins.extract;
//     const canvas = extract.canvas(renderTexture);
//     canvas.toBlob((blob) => {
//       // Create a temporary anchor element to trigger the download
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = filename;
//       link.style.display = 'none';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Clean up
//       URL.revokeObjectURL(link.href);

//       application.stage.removeChild(renderTexture);
//     }, 'image/png');
//   }

//   static getSerializedRoom(room, avatar) {
//     const roomData = {
//       wallColor: room.wallColor,
//       floorColor: room.floorColor,
//       avatar: avatar ? avatar.toJSON() : null,
//       items: [],
//     };

//     room.roomObjects.forEach((object) => {
//       if (object instanceof FloorFurniture) {
//         roomData.items.push(Utils.floorFurnitureItemToJSON(object));
//       }
//     });

//     return roomData;
//   }

//   static floorFurnitureItemToJSON(floorFurniture) {
//     return {
//       type: floorFurniture.type,
//       roomX: floorFurniture.roomX,
//       roomY: floorFurniture.roomY,
//       roomZ: floorFurniture.roomZ,
//       direction: floorFurniture.direction,
//       animation: floorFurniture.animation,
//     };
//   }

//   static addFloatingDot(furnitureItem) {
//     if (!furnitureItem.floatingDot) {
//       furnitureItem.alpha = 0.7;
//     }
//   }

//   static removeFloatingDot(furnitureItem) {
//     furnitureItem.alpha = 1;
//   }

//   // Additional utility functions...
// }

// export default class Game {
//   constructor(view, roomData, buildMode = false, tilemap = null, smallRoom) {
//     this.setupPixiApp(view);
//     this.shroom = this.createShroom();
//     gsap.ticker.fps(120);
//     this.actionLock = false;

//     //TileMap
//     if (!tilemap) {
//       tilemap = `xxxxx
//         x0000
//         x0000
//         x0000
//         x0000`;
//     }

//     this.room = smallRoom
//       ? new SmallRoom(roomData, buildMode, tilemap, this.shroom)
//       : new Room(roomData, buildMode, tilemap, this.shroom);

//     // Animation;

//     this.animation = new Animation();

//     this.createBackground();

//     if (roomData.avatar) {
//       this.avatar = AvatarWrapper.createAvatar(roomData.avatar);
//       this.room.room.addRoomObject(this.avatar); // Fix 1
//     }

//     this.selectedFurnitureItem = null;
//   }

//   setupPixiApp(view) {
//     const canvasContainer = document.getElementById('app');
//     const canvasWidth = canvasContainer.clientWidth;
//     this.application = new PIXI.Application({
//       view,
//       antialias: false,
//       resolution: window.devicePixelRatio,
//       autoDensity: true,
//       width: canvasWidth,
//       height: document.getElementById('canvas').clientHeight,
//       transparent: false,
//     });
//     // eslint-disable-next-line no-undef
//     globalThis.__PIXI_APP__ = this.application;
//     PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
//   }

//   createShroom() {
//     return Shroom.create({
//       application: this.application,
//       resourcePath: 'https://ducket-net.github.io/resources',
//     });
//   }
//   setBackground(bgColor) {
//     let convertHex = parseInt(bgColor.slice(1), 16);
//     this.room.room.application.renderer.backgroundColor = convertHex;
//   }

//   downloadRoomAsPNG(filename = 'room.png') {
//     Utils.downloadRoomAsPNG(this.application, this.room.room, filename);
//   }

//   getSerializedRoom() {
//     return Utils.getSerializedRoom(this.room.room, this.avatar);
//   }

//   createBackground() {
//     PIXI.Loader.shared.reset(); // Reset the PIXI.Loader.shared
//     PIXI.Loader.shared
//       .add('backgroundImage', '6432-grid_2.png')
//       .load((_, resources) => {
//         // Create a TilingSprite from the texture
//         const background = new PIXI.TilingSprite(
//           resources.backgroundImage.texture,
//           this.application.screen.width,
//           this.application.screen.height
//         );

//         // Set the size of the TilingSprite
//         background.width = this.application.screen.width;
//         background.height = this.application.screen.height;

//         // Needed, iOS 17 does not seem to respect alpha.
//         if (isIOS17()) {
//           background.alpha = 0.1;
//         }

//         // Add the TilingSprite to the stage
//         this.application.stage.addChildAt(background, 0); // Reverted to the original line
//       });
//   }

//   //Include
//   animateDropFurnitureItem(furnitureItem) {
//     Animation.animateDropFurnitureItem(furnitureItem);
//   }

//   animateTap(furnitureItem) {
//     Animation.animateTap(furnitureItem);
//   }

//   moveFurnitureItem(furnitureItem, moveX, moveY) {
//     Animation.moveFurnitureItem(furnitureItem, moveX, moveY);
//   }

//   addItem(itemData) {
//     this.room.addItem(itemData);
//   }
//   //onFurnitureItemClick

//   onFurnitureItemClick(item) {
//     if (this.selectedFurnitureItem && this.selectedFurnitureItem !== item) {
//       this.room.roomObjects.forEach((object) => {
//         if (object instanceof FloorFurniture && object !== item) {
//           object.alpha = 0.5;
//         }
//       });
//       this.alpha = 1;
//       EventBus.$emit('item-unselected', this.selectedFurnitureItem);
//     }

//     if (this.selectedFurnitureItem === item) {
//       EventBus.$emit('item-unselected', item);
//       this.selectedFurnitureItem = null;
//       this.room.roomObjects.forEach((object) => {
//         if (object instanceof FloorFurniture && object !== item) {
//           object.alpha = 1;
//         }
//       });
//     } else {
//       EventBus.$emit('item-selected', item);
//       this.room.roomObjects.forEach((object) => {
//         if (object instanceof FloorFurniture && object !== item) {
//           object.alpha = 0.5;
//         }
//       });
//       this.alpha = 1;
//       this.selectedFurnitureItem = item;
//     }
//   }

//   // Additional methods or properties specific to the Game class...
// }
