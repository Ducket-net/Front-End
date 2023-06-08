<template>
  <div class="mt-4 bg-white rounded-md bg-opacity-50 shadow-md p-4 text-white">
    <h3 class="text-xs uppercase font-mono text-white mb-3">Catalog</h3>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search items..."
      class="p-2 w-full bg-gray-100 rounded"
    />
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="flex items-center p-2 my-2 bg-slate-500 rounded cursor-pointer hover:bg-gray-200"
      @click="selectItem(item)"
    >
      <img :src="item.image_url" class="max-w-[30px]" />
      <div class="ml-4">
        <h4 class="text-sm font-semibold">{{ item.name }}</h4>
        <p class="text-xs">
          {{ item.classname }} | {{ item.category }} | {{ item.furniline }}
        </p>
      </div>
      <button
        @click.stop="addToRoom(item.classname)"
        class="ml-auto px-3 py-1 bg-green-500 text-white rounded text-xs"
      >
        Add
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "ItemCatalog",
  data() {
    return {
      searchQuery: "",
    };
  },
  computed: {
    ...mapState(["catalog"]),
    filteredItems() {
      if (this.searchQuery === "") return this.catalog;
      return this.catalog.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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
    addToRoom(classname) {
      console.log("Add to room", classname);
      this.$root.$emit("add-to-room", classname);
    },
    ...mapActions(["fetchSearchResults"]),
    selectItem() {
      //   alert("ToDo: Perform an action with the selected item");
      console.log("Selected");
    },
  },
};
</script>
