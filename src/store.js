// src/store.js
import { createStore } from 'vuex';
import axios from 'axios';
const storedAccessToken = localStorage.getItem('access_token');
const storedUser = JSON.parse(localStorage.getItem('user'));

const store = createStore({
  state: {
    game: {},
    roomId: 'home',
    hideHeader: false,
    showSplashScreen: true,
    rooms: {},
    messages: [],
    catalog: {
      items: [],
      lines: [],
      categories: [],
    },
    currentRoom: null,
    //Auth
    user: storedUser,
    accessToken: storedAccessToken,
    pixiInstance: null,
    room: {
      id: null,
      avatar: null,
      items: [],
      size: '',
      settings: {
        bgColor: '#1A1F25', // '#ffffff'
        wallColor: '#ffffff', // '#ffffff
        floorColor: '#ffffff', // '#ffffff
        hideWalls: false,
        hideFloor: false,
      },
    },
  },
  mutations: {
    addMessage(state, payload) {
      state.messages.push(payload);
    },
    sendMessage({ commit }, payload) {
      commit('addMessage', payload);
    },

    setRoomSettings(state, roomData) {
      state.room = roomData;
      localStorage.setItem('settings', JSON.stringify(state.room.settings));
    },
    setGame(state, game) {
      console.log('👋 Game Set!');
      state.game = game;
    },
    setRoomX(state, x) {
      state.room.settings.x = x;
    },
    saveRoomToLocalStorage() {
      const roomData = this.state.game.getSerializedRoom();
      //Appebd Settings

      roomData.settings = this.state.room.settings;
      localStorage.setItem(
        'room-' + this.state.roomId,
        JSON.stringify(roomData)
      );
      console.log(roomData);
      console.log('👋 Room Saved!');

      //Create or update room in rooms array
      const rooms = JSON.parse(localStorage.getItem('rooms')) || {};

      rooms[this.state.roomId] = roomData;
      localStorage.setItem('rooms', JSON.stringify(rooms));
    },
    setRoomWallDisplay(state, value) {
      state.room.settings.hideWalls = value;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomFloorDisplay(state, value) {
      state.room.settings.hideFloor = value;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomY(state, y) {
      state.room.settings.y = y;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomBgColor(state, color) {
      state.room.settings.bgColor = color;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomWallColor(state, color) {
      state.room.settings.wallColor = color;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomFloorColor(state, color) {
      state.room.settings.floorColor = color;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomHideWalls(state, value) {
      state.room.settings.hideWalls = value;
      this.commit('saveRoomToLocalStorage');
    },
    setRoomHideFloor(state, value) {
      state.room.settings.hideFloor = value;
      this.commit('saveRoomToLocalStorage');
    },
    setPixiInstance(state, instance) {
      state.pixiInstance = instance;
    },
    setShroom(state, shroom) {
      state.shroom = shroom;
    },
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    setHideHeader(state, value) {
      state.hideHeader = value;
    },
    setShowSplashScreen(state, value) {
      state.showSplashScreen = value;
    },
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setCatalog(state, { catalog, lines, categories }) {
      state.catalog.items = catalog;
      state.catalog.lines = lines;
      state.catalog.categories = categories;
    },
    updateRoom(state, { roomId, items }) {
      state.rooms[roomId] = items;
    },
    setAccessTokenAndUser(state, { token, user }) {
      state.accessToken = token;
      state.user = user;
    },
  },
  getters: {
    pixiInstance: (state) => state.pixiInstance,
    shroom: (state) => state.shroom,
    loggedInUser: (state) => state.user,
    isUserLoggedIn: (state) => !!state.accessToken,
    currentRoom: (state) => state.room,
    roomSettings: (state) => state.room.settings,
    game: (state) => state.game,
    catalog: (state) => state.catalog,
  },
  actions: {
    sendMessage(context, payload) {
      context.commit('addMessage', payload);
    },
    async authenticate({ commit }, accessToken) {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/me`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const user = response.data;

        // Save the access token and user data in the Vuex state
        commit('setAccessTokenAndUser', { token: accessToken, user: user });

        // Save the access token and user data in localStorage
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(user));

        return true;
      } catch (error) {
        console.error('Error authenticating user:', error);
        return false;
      }
    },

    updateShowSplashScreen({ commit }, value) {
      commit('setShowSplashScreen', value);
    },
    async fetchCurrentRoom({ commit }, roomId) {
      try {
        let roomData;

        console.log('👋 Fetching room:', roomId);

        // Check if room data exists in local storage
        if (localStorage.getItem('room-' + roomId) && roomId !== 'home') {
          roomData = JSON.parse(localStorage.getItem('room-' + roomId));
        } else {
          // If no room data in local storage, fetch from server
          // Replace the URL with your actual server URL
          const response = await axios.get(`/room-${roomId}.json`);
          roomData = response.data;
        }

        commit('setRoomSettings', roomData);
        commit('setCurrentRoom', roomData);
        return roomData;
      } catch (error) {
        console.error('Error fetching room:', error);
        return null;
      }
    },
    async selectRoomById({ commit, dispatch }, roomId) {
      const room = await dispatch('fetchCurrentRoom', roomId);
      if (room) {
        commit('setCurrentRoom', room);
      }
    },
    async fetchCatalog({ commit }) {
      if (localStorage.getItem('catalog')) {
        const catalog = JSON.parse(localStorage.getItem('catalog'));
        commit('setCatalog', catalog);
      }
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/catalog`,
          {
            headers: {
              // Authorization: `Bearer ${localStorage.getItem('access_token')}`,
              Accept: 'application/json',
              ContentType: 'application/json',
            },
            body: {},
          }
        );

        // Extract the catalog, lines, and categories from the response
        const { catalog, lines, categories } = response.data;

        // Set the catalog, lines, and categories in the Vuex state
        commit('setCatalog', { catalog, lines, categories });
        //Store into local storage
        localStorage.setItem('catalog', JSON.stringify(response.data));
      } catch (error) {
        console.error('Unable to fetch catalog data:', error);
      }
    },
    async fetchSearchResults({ commit }, searchQuery) {
      try {
        const ducketUrl = process.env.DUCKET_URL;
        const response = await axios.get(
          `${ducketUrl}/api/marketSearch/basicSearch?search=${searchQuery}`
        );
        commit('setCatalog', response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },
  },
});

export default store;
