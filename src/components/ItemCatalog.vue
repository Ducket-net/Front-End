<template>
  <div>
    <h2>Catalog</h2>
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search items..."
      class="p-2 bg-gray-100 rounded"
    />
    <div
      v-for="item in filteredItems"
      :key="item.id"
      class="flex items-center p-2 cursor-pointer hover:bg-gray-100"
      @click="selectItem(item)"
    >
      <img :src="item.image_url" class="w-8 h-8" />
      <span class="ml-2">{{ item.name }}</span>
      <button
        @click="addToRoom(item.classname)"
        class="ml-2 px-2 py-1 bg-green-500 text-white rounded"
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
