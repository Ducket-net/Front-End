<template>
  <div class="">
    <div v-for="(search, index) in searches" :key="index">
      <ItemCatalog :index="index" :search="search" />
    </div>
    <button
      @click="addSearch"
      class="px-4 py-2 mx-auto block w-full bg-black bg-opacity-10 hover:bg-opacity-20 text-white rounded-md"
    >
      <font-awesome-icon :icon="['fas', 'plus']" /> Add
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
