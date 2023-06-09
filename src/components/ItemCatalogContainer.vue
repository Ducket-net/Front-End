<template>
  <div class="grid grid-cols-2 gap-0.5">
    <div v-for="(search, index) in searches" :key="index">
      <ItemCatalog :index="index" :search="search" />
    </div>
    <button
      @click="addSearch"
      class="text-white px-4 py-2 mx-auto block w-full bg-black bg-opacity-10 mt-2 rounded-md hover:bg-opacity-20"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
  </div>
</template>

<script>
import ItemCatalog from "./ItemCatalog.vue";

export default {
  name: "ItemCatalogContainer",
  components: {
    ItemCatalog,
  },
  data() {
    return {
      searches: [{}],
    };
  },
  created() {
    if (localStorage.getItem("searches")) {
      this.searches = JSON.parse(localStorage.getItem("searches"));
    }
  },
  methods: {
    addSearch() {
      this.searches.push({});
      localStorage.setItem("searches", JSON.stringify(this.searches));
    },
  },
};
</script>
