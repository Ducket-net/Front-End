<!-- eslint-disable vue/require-v-for-key -->
<template>
  <div>
    <div
      v-if="selectedCategory"
      class="grid grid-cols-9 gap-1 p-0.5 mt-2 rounded-lg"
    >
      <button
        class="capitalize min-h-[42px] text-center col-span-3 items-center px-2 bg-white rounded cursor-pointer hover:bg-black hover:text-white"
        @click.stop="clearSearch"
      >
        Clear {{ selectedCategory }}
      </button>
      <div
        v-for="item in searchResults"
        :key="item.id"
        class="flex min-h-[42px] items-center px-2 bg-white rounded cursor-pointer hover:bg-black object-center"
        @click.stop="addToRoom(item.classname)"
      >
        <div class="mx-auto">
          <furni-img :classname="item.classname" />
        </div>
      </div>
    </div>
    <div>
      <ItemCatalog :index="99" />
    </div>
    <SpecialButton
      class="bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg w-full"
      @button-click="loadCatalog"
      v-if="!catalog.lines.length"
    >
      {{ catalogLoading ? 'Loading...' : 'Open Catalog' }}
    </SpecialButton>
    <div class="grid grid-cols-3 gap-1" v-if="catalog.lines.length">
      <h2
        class="col-span-3 bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg"
      >
        Categories
      </h2>
      <div
        class="bg-white p-1 rounded-lg capitalize text-center text-sm font-bold py-3 active:bg-[#1A1F25] active:text-white"
        v-for="catagory in catalog.categories"
        @click="toggleCatalog('category', catagory)"
        :class="{ 'bg-slate-900 text-white': selectedCategory == catagory }"
      >
        {{ catagory }}
      </div>

      <h2
        class="col-span-3 bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg"
      >
        Lines
      </h2>
      <div
        class="bg-white p-1 rounded-lg capitalize text-center text-sm font-bold py-3 active:bg-[#1A1F25] active:text-white"
        v-for="line in catalog.lines"
        @click="toggleCatalog('line', line)"
        :class="{ 'bg-slate-900 text-white': selectedLine == line }"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import ItemCatalog from './ItemCatalog.vue';
import SpecialButton from './SpecialButton.vue';

export default {
  name: 'FurniCatalog',
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      selectedColor: {},
      selectedCategory: '',
      selectedLine: '',
      showCatalog: false,
      listeners: [],
      categoryState: {},
      showColors: {},
      catalogLoading: false,
      catalog: {
        categories: [],
        lines: [],
        items: [],
      },
    };
  },
  components: {
    ItemCatalog,
    SpecialButton,
  },
  async created() {},
  computed: {},
  watch: {},
  methods: {
    ...mapActions(['fetchCatalog']),
    async loadCatalog() {
      this.catalogLoading = !this.catalogLoading;
      await this.fetchCatalog();
      this.catalogLoading = !this.catalogLoading;
      this.catalog = this.$store.state.catalog;
    },
    clearSearch() {
      this.searchResults = [];
      this.selectedCategory = '';
    },
    toggleCatalog(type, category) {
      this.clearSearch();

      //Scroll to top of div
      const catalogDiv = document.getElementById('viewport');
      catalogDiv.scrollTop = 0;

      setTimeout(() => {
        category = category.trim();

        if (type == 'category') {
          this.catalog.items.forEach((item) => {
            if (item.category == category) {
              this.searchResults.push(item);
            }
          });
        } else if (type == 'line') {
          this.catalog.items.forEach((item) => {
            if (item.furniline == category) {
              this.searchResults.push(item);
            }
          });
        }
        this.selectedCategory = category;
      }, 10);
    },
    toggleLine(line) {
      this.selectedLine = line;
    },
    notWhite(color) {
      for (let i = 0; i < color.length; i++) {
        color[i] = color[i].toLowerCase();
        if (color[i] != '#ffffff') {
          return color[i];
        }
      }
    },
    openColors(groupName) {
      this.showColors = {
        ...this.showColors,
        [groupName]: !this.showColors[groupName],
      };
    },
    toggleSubCategory(subCategoryName) {
      // Use Vue.set() to ensure reactivity
      if (this.categoryState[subCategoryName] === undefined) {
        this.$set(this.categoryState, subCategoryName, true);
      } else {
        this.$set(
          this.categoryState,
          subCategoryName,
          !this.categoryState[subCategoryName]
        );
      }
    },
    openCatalog() {
      try {
        this.$refs.catalogSheet.open();
      } catch (error) {
        console.error('Unable to open catalog:', error);
      }
    },
    closeCatalog() {
      this.$refs.catalogSheet.close();
    },
    addToRoom(classname) {
      this.$root.$emit('add-to-room', classname);
    },
    replaceAsteriskWithUnderscore(classname) {
      const match = classname.match(/\*(\d+)$/);
      return match ? classname.replace(/\*(\d+)$/, '_' + match[1]) : classname;
    },
    selectColor(item, color) {
      this.selectedColor = { item, color };

      //Update the image where id = item.classname img
      let baseClassname = item.baseClassname;
      const parentElement = document.getElementById(baseClassname);
      const furniImgComponent = parentElement.querySelector('img');
      //Refactor this to use the FurniImg component
      furniImgComponent.src = `https://ducket-net.github.io/resources/icons/${this.replaceAsteriskWithUnderscore(
        item.classname
      )}_icon.png`;

      const addToRoomButton = parentElement.querySelector('.controller-button');
      //Add Class
      addToRoomButton.classList.remove('hidden');

      // Remove the old event listener if there is one
      if (this.listeners[item.baseClassname]) {
        addToRoomButton.removeEventListener(
          'click',
          this.listeners[item.baseClassname]
        );
      }

      // Define the new event listener
      const newListener = () => {
        this.addToRoom(item.classname);
      };

      // Add the new event listener
      addToRoomButton.addEventListener('click', newListener);

      // Store the new event listener for the given classname
      this.listeners[item.baseClassname] = newListener;
    },
    createGroupKey(classname) {
      if (!classname) {
        return '';
      }

      let key = classname
        .replace(/\*\d+$/, '') // Remove *1, *2, etc., from the classname
        .trim();

      return key.toLowerCase();
    },
    replaceUnderscoreWithAsterisk(classname) {
      const match = classname.match(/_(\d+)$/);
      return match ? classname.replace(/_(\d+)$/, '*' + match[1]) : classname;
    },
    removeAsteriskFromClassName(classname) {
      return classname.replace(/\*\d+$/, '');
    },
    getCategoryMapping() {
      return {
        Classic: [
          'iced',
          'mode',
          'plasto',
          'rugs',
          'legacy',
          'lodge',
          'pura',
          'plants',
          'extras',
        ],
        'Event-based': [
          'valentine_2013',
          'valentine_2014',
          'valentine_2015',
          'valentine_2016',
          'valentine_2018',
          'valentine_2019',
          'valentine_2020',
          'valentine_2021',
          'valentine_2022',
          'valentine_2011',
          'st_patricks',
          'easter_2011',
          'easter_2013',
          'easter_2014',
          'easter_2016',
          'easter_2017',
          'easter_2018',
          'easter_2019',
          'easter_2020',
          'easter_2021',
          'easter_2022',
          'easter_2023',
          'habboween_2009',
          'habboween_2011',
          'habboween_2012',
          'habboween_2013',
          'habboween_2014',
          'habboween_2015',
          'habboween_2016',
          'habboween_2017',
          'habboween_2018',
          'habboween_2019',
          'habboween_2020',
          'habboween_2021',
          'habboween_2022',
          'habboween',
          'xmas2009',
          'xmas2010',
          'xmas2010_quest_items',
          'xmas2011',
          'xmas2012',
          'xmas2013',
          'xmas2014',
          'xmas2015',
          'xmas2016',
          'xmas2017',
          'xmas2018',
          'xmas2019',
          'xmas2020',
          'xmas2021',
          'xmas2022',
          'xmas_c17_man',
          'newyear_2015',
          'newyear_2016',
          'newyear_2017',
          'newyear_2018',
          'newyear_2019',
          'newyear_2020',
          'newyear_2021',
          'newyear_2022',
          'newyear_2023',
        ],
        Themed: [
          'bedroom',
          'kitchen',
          'baths',
          'dining_room',
          'garden',
          'office',
          'household',
          'hotel',
          'supermarket',
          'boutique',
          'cafe',
          'home_cinema',
          'sports',
          'asian',
          'african',
          'greek',
          'vikings',
          'art',
          'classics',
          'glass',
          'gothic',
          'scifi',
          'tiki',
          'antique',
          'jungle',
          'area',
          'paris',
          'sunsetcafe',
          'india',
          'sanrio',
          'greek',
        ],
        Collections: [
          'rare',
          'nft',
          'collectibles',
          'classics',
          'trophies',
          'buildersclub',
          'buildersclub_alpha1',
          'bonusrare',
          'credit_furni',
          'diamond',
          'habbo_club_gifts',
          'specialtype',
          'excludeddynamic',
        ],
        Gaming: ['wired', 'arcade', 'snowboard', 'gambling', 'football'],
        Miscellaneous: ['testing', 'undefined', 'military', 'animals'],
      };
    },
    filterCatalogItems(query) {
      this.searchResults = this.catalog.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    },
  },
};
</script>

<style scoped>
.grid-item {
  height: 100%;
}
</style>
