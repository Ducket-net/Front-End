<template>
  <transition name="fade">
    <div
      v-if="roomSettingsOpen"
      class="max-w-md mx-auto pt-[42px] absolute top-0 left-0 right-0"
    >
      <!-- BG Color -->

      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showBgColorPicker"
      >
        <Swatches v-model="bgColor" />
        <button
          @click="showBgColorPicker = false"
          class="w-full py-2 h-[42px] mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Background Picker
        </button>
      </div>
      <!-- BG Color -->

      <!-- Wall Color -->
      <div
        @click="showWallColorPicker = !showWallColorPicker"
        class="rounded-full absolute top-48 transform left-1/2 translate-x-24 -translate-y-0 bg-black text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon
          class="text-white overflow-auto rounded-lg"
          icon="cube"
        />
        Wall
      </div>
      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showWallColorPicker"
      >
        <Swatches v-model="wallColor" />
        <button
          @click="showWallColorPicker = false"
          class="w-full py-2 h-[42px] mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Wall Picker
        </button>
      </div>
      <!-- Wall Color -->

      <!-- Floor Color -->
      <div
        @click="showFloorColorPicker = !showFloorColorPicker"
        class="absolute top-64 transform left-1/2 -translate-x-1/2 translate-y-16 bg-black text-white overflow-auto rounded-full bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon
          class="text-white overflow-auto rounded-lg"
          icon="cube"
        />
        Floor
      </div>
      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showFloorColorPicker"
      >
        <Swatches v-model="floorColor" />
        <button
          @click="showFloorColorPicker = false"
          class="w-full h-[42px] py-2 mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Floor Picker
        </button>
      </div>
      <!-- Floor Color -->

      <div class="grid grid-cols-3 grid-rows-2 text-left">
        <button
          @click="roomSettingsOpen = false"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'close']" /> Close Settings
        </button>

        <button
          @click="showBgColorPicker = !showBgColorPicker"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <!-- <font-awesome-icon
              class="text-white overflow-auto rounded-lg"
              icon="cube"
            /> -->
          <!-- Background -->
        </button>
        <button
          @click="clearLocalStorage"
          class="top-80 text-red-500 overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'trash']" /> Reset All
        </button>

        <button
          @click="toggleWall"
          class="top-32 text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          Toggle Wall
        </button>

        <button
          @click="toggleFloor"
          class="left-0 top-[55px] text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          Toggle Floor & Wall
        </button>

        <button
          @click="showBgColorPicker = !showBgColorPicker"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon
            class="text-white overflow-auto rounded-lg"
            icon="cube"
          />
          Background
        </button>

        <div class="grid col-span-3 grid-cols-4 mt-64">
          <button
            @click="moveRoom('up')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomUp
          </button>
          <button
            @click="moveRoom('down')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomDown
          </button>
          <button
            @click="moveRoom('left')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomLeft
          </button>
          <button
            @click="moveRoom('right')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomRight
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
