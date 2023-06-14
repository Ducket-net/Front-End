// src/store.js
import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rooms: {},
    catalog: [],
    currentRoom: null,
    //Auth
    user: null,
    accessToken: null,
  },
  mutations: {
    setCurrentRoom(state, room) {
      state.currentRoom = room;
    },
    setRooms(state, rooms) {
      state.rooms = rooms;
    },
    setCatalog(state, catalog) {
      state.catalog = catalog;
    },
    updateRoom(state, { roomId, items }) {
      Vue.set(state.rooms, roomId, items);
    },
  },
  actions: {
    async fetchCurrentRoom({ commit }, roomId) {
      try {
        let roomData;

        // Check if room data exists in local storage

        if (localStorage.getItem("savedRoom")) {
          roomData = JSON.parse(localStorage.getItem("savedRoom"));
        } else {
          // If no room data in local storage, fetch from server
          // Replace the URL with your actual server URL
          const response = await axios.get(`/room-${roomId}.json`);
          roomData = response.data;
        }

        commit("setCurrentRoom", roomData);
        return roomData;
      } catch (error) {
        console.error("Error fetching room:", error);
        return null;
      }
    },
    async selectRoomById({ commit, dispatch }, roomId) {
      const room = await dispatch("fetchCurrentRoom", roomId);
      if (room) {
        commit("setCurrentRoom", room);
      }
    },
    async fetchCatalog({ commit }) {
      const response = await axios.get(`/catalog.json`);
      commit("setCatalog", response.data.catalog);
    },
    async fetchSearchResults({ commit }, searchQuery) {
      try {
        const response = await axios.get(
          `https://ducket.net/api/marketSearch/basicSearch?search=${searchQuery}`
        );
        commit("setCatalog", response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
  },
});
