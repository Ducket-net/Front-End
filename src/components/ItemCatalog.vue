<template>
  <div
    ref="catalog"
    class="max-h-52 overflow-y-scroll no-scrollbar mt-4 bg-white rounded-md bg-opacity-50 shadow-md p-4 text-white"
  >
    <!-- Minimize -->
    <div class="flex">
      <h3
        @click="minimize"
        class="flex-auto text-xs uppercase font-mono text-white mb-3"
        :class="{ 'cursor-pointer': minimized }"
      >
        {{ searchQuery ? searchQuery : "Catalog" }}
      </h3>
      <button
        @click="minimize"
        class="flex-shrink w-5 h-5 flex items-center justify-center rounded-md bg-black bg-opacity-40 text-white"
      >
        <font-awesome-icon :icon="['fas', 'minus']" v-if="!minimized" />
        <font-awesome-icon :icon="['fas', 'plus']" v-if="minimized" />
      </button>
    </div>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search items..."
      class="p-2 w-full bg-gray-100 rounded text-black"
    />
    <div class="grid grid-cols-2 gap-1 p-0.5 mt-2">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="flex min-h-[42px] items-center px-2 bg-slate-500 rounded cursor-pointer hover:bg-black"
        @click.stop="addToRoom(item.classname)"
      >
        <img :src="item.image_url" class="max-w-[30px]" />
        <div class="ml-1">
          <h4 class="text-xs font-semibold">{{ item.name }}</h4>
          <!-- <p class="text-xs">
            {{ item.classname }} | {{ item.category }} | {{ item.furniline }}
          </p> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "ItemCatalog",
  props: {
    index: {
      type: Number,
      required: true,
    },
    search: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      minimized: false,
      searchQuery: "",
      searchResults: [], // Add this to store search results for each component
    };
  },
  created() {
    if (localStorage.getItem(`searchQuery_${this.index}`)) {
      this.searchQuery = localStorage.getItem(`searchQuery_${this.index}`);
    }
    if (localStorage.getItem(`searchResults_${this.index}`)) {
      this.searchResults = JSON.parse(
        localStorage.getItem(`searchResults_${this.index}`)
      );
    }
  },
  mounted() {
    // Listen for the "add-to-room" event
    if (localStorage.getItem(`minimized_${this.index}`)) {
      //   this.minimized = localStorage.getItem(`minimized_${this.index}`);

      if (localStorage.getItem(`minimized_${this.index}`) === "true") {
        this.$refs.catalog.classList.toggle("max-h-12");
        this.minimized = true;
      }
    }
  },
  computed: {
    ...mapState(["catalog"]),
    filteredItems() {
      if (this.searchQuery === "") return this.catalog;
      if (this.searchResults.length > 0) {
        // Use this.searchResults instead of calling the Vuex store
        localStorage.setItem(
          `searchResults_${this.index}`,
          JSON.stringify(this.searchResults)
        );
        return this.searchResults.filter((item) =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
      return [];
    },
  },
  watch: {
    searchQuery: {
      handler(query) {
        if (query.length > 2) {
          this.fetchSearchResults(query);
        }
      },
      immediate: false,
    },
  },
  methods: {
    minimize() {
      this.$refs.catalog.classList.toggle("max-h-12");
      this.minimized = !this.minimized ? true : false;
      localStorage.setItem(`minimized_${this.index}`, this.minimized);
    },
    async fetchSearchResults(query) {
      try {
        const response = await axios.get(
          `https://ducket.net/api/marketSearch/basicSearch?search=${query}`
        );
        // setState locally, instead of committing to Vuex
        this.searchResults = response.data;
        localStorage.setItem(
          `searchResults_${this.index}`,
          JSON.stringify(response.data)
        );
        localStorage.setItem(`searchQuery_${this.index}`, this.searchQuery);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    },
    addToRoom(classname) {
      console.log("Add to room", classname);
      this.$root.$emit("add-to-room", classname);
    },
    selectItem() {
      //   alert("ToDo: Perform an action with the selected item");
      console.log("Selected");
    },
  },
};
</script>
