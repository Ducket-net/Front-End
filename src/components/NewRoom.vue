<!-- NewRoom.vue -->
<template>
  <div>
    <input id="hiddenInput" style="visibility: hidden" />
    <button
      @click="onNewButtonClick"
      class="text-right text-xs text-white mr-4 leading-6 controller-button rounded-lg px-2 py-0"
    >
      Rooms
    </button>

    <vue-bottom-sheet
      ref="myBottomSheet"
      :overlay="false"
      :click-to-close="true"
      :background-clickable="true"
    >
      <div>
        <div class="">
          <h2 class="font-bold text-sm">Rooms</h2>
          <p class="text-sm">
            Load current rooms, to delete go to settings > reset. Which will
            reset all rooms.
          </p>
        </div>
        <ul class="bg-black bg-opacity-25 rounded-lg p-4 my-4 text-white">
          <div v-if="loadRooms().length === 0" class="text-center">
            <p class="text-sm">You have no saved rooms yet.</p>
          </div>
          <li
            v-for="(room, index) in loadRooms()"
            :key="index"
            class="flex mb-1 pb-2 border-b border-white border-opacity-10 last:border-0 last:pb-0 last:mb-0"
          >
            <div class="flex-grow px-3 py-2">
              {{ room.name }}
              <span class="text-xs">({{ room.itemsInRoom }} items)</span>
            </div>
            <button
              @click="selectRoom(room)"
              class="flex-shink text-xs text-white controller-button rounded-lg px-3 py-2"
            >
              <font-awesome-icon :icon="['fas', 'eye']" />
            </button>
          </li>
        </ul>
        <hr class="my-4" />
        <div class="">
          <h2 class="font-bold text-sm">Name your Current Room</h2>
          <p class="text-sm">
            Saving happens automatically, but you can name it for future
            reference.
          </p>
        </div>
        <form @submit.prevent="submitRoom(roomName)">
          <div class="">
            <input
              ref="roomNameInput"
              type="text"
              id="roomName"
              name="roomName"
              v-model="roomName"
              class="my-2 w-full px-3 p-1 rounded-lg border text-black border-black text-xs h-12"
              placeholder="Enter a name for your room"
            />
          </div>

          <button
            class="w-full py-3 mb-8 font-semibold bg-green-600 save-button text-white rounded-lg border border-1 border-b-2 border-black text-xs h-12"
          >
            <font-awesome-icon :icon="['fas', 'star']" /> Save
          </button>
        </form>
      </div>
    </vue-bottom-sheet>
  </div>
</template>

<script>
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet';
import axios from 'axios';

export default {
  name: 'NewRoom',
  components: {
    VueBottomSheet,
  },
  data() {
    return {
      roomName: '',
    };
  },
  created() {},
  methods: {
    submitRoom(name) {
      const currentRoom = this.$store.state.room;

      // update room id in store
      localStorage.removeItem('room-blank');
      this.$store.commit('setRoomId', name);
      this.$store.commit('saveRoomToLocalStorage');

      const url = 'https://api.jsonbin.io/v3/b';

      const headers = {
        'Content-Type': 'application/json',
        'X-Master-Key':
          '$2b$10$5IRGtaCpxp8WwyEO9yuZmOCGr0w9yZMv1aBV5LyvAutcGU8yyXAzC',
        'X-Collection-Id': '648a9486b89b1e2299af4bc1',
        'X-Bin-Name': name,
      };
      const data = {
        name: name,
        data: currentRoom,
      };

      axios
        .post(url, data, { headers: headers })
        .then(() => {
          location.reload();
        })
        .catch(() => {
          localStorage.removeItem('savedRoom');
          location.reload();
        });
      this.closeBottomSheet();
    },
    selectRoom(room) {
      // Replace the current savedRoom with the selected room
      this.loadRoom(room);
    },

    loadRooms() {
      let rooms = JSON.parse(localStorage.getItem('rooms') || '[]');
      console.log(rooms);

      // Convert rooms to array
      if (rooms && !Array.isArray(rooms)) {
        //Add in the main key as the "name" attr

        //Skip default room name
        if (rooms['blank']) {
          delete rooms['blank'];
        }

        rooms = Object.keys(rooms).map((key) => {
          return {
            name: key,
            //Count items
            itemsInRoom: Object.keys(rooms[key]).length,
            ...rooms[key],
          };
        });
      }
      return rooms;
    },
    async loadRoom(room) {
      if (
        !confirm(
          "Please make sure you've saved your room. Are you sure you want to leave"
        )
      ) {
        return;
      }

      console.log('Loading room');
      console.log(room);

      //Copy room.name localstorage to room.blank
      //Remove room blank

      localStorage.removeItem('room-blank');

      localStorage.setItem(
        'room-blank',
        localStorage.getItem('room-' + room.name)
      );

      //Reload
      location.reload();
    },
    openBottomSheet() {
      this.$refs.myBottomSheet.open();
      var inputElement = document.getElementById('hiddenInput');
      inputElement.style.visibility = 'visible'; // unhide the input
      inputElement.focus(); // focus on it so keyboard pops
      inputElement.style.visibility = 'hidden'; // hide it again

      //Open keyboard
      setTimeout(() => {
        this.$refs.roomNameInput.focus();
      }, 70);
    },
    closeBottomSheet() {
      this.$refs.myBottomSheet.close();
    },
    onNewButtonClick() {
      this.openBottomSheet();
    },
  },
};
</script>

<style scoped>
.controller-button {
  background-color: #3b82f6; /* Add your desired button background color */
  cursor: pointer;
}
.controller-button:hover {
  background-color: #2563eb; /* Add your desired button hover background color */
}
</style>
