<!-- eslint-disable vue/require-v-for-key -->
<template>
  <vue-bottom-sheet
    ref="catalogSheet"
    :overlay="true"
    :click-to-close="true"
    :background-clickable="false"
    :background-scrollable="true"
    max-height="50%"
    :swipe-able="false"
  >
    <div v-if="showCatalog">
      <div
        class="overflow-x-scroll h-screen touch-pan-y no-scrollbar pb-10 mb-10"
      >
        <!-- LOOP OVER ALL CATEGORIES -->
        <div
          v-for="(subCategories, categoryName) in categorizedItems"
          :key="categoryName"
          class="text-xs mb-2"
        >
          <div class="text-white bg-black p-2 rounded-lg mb-1">
            {{ categoryName }} ({{
              Object.values(subCategories)
                .map((itemGroups) =>
                  Object.values(itemGroups)
                    .map((group) => group.items.length)
                    .reduce((sum, count) => sum + count, 0)
                )
                .reduce((sum, count) => sum + count, 0)
            }})
          </div>
          <!-- Building main categories and looping through sub-categories -->

          <!-- LOOP OVER ALL SUB-CATEGORIES -->
          <template v-for="(itemGroups, subCategoryName) in subCategories">
            <div
              @click="toggleSubCategory(subCategoryName)"
              :key="subCategoryName + '_title'"
              class="text-xs font-bold p-2 cursor-pointer capitalize active:text-blue-500"
            >
              {{ subCategoryName }} ({{
                Object.values(itemGroups)
                  .map((group) => group.items.length)
                  .reduce((sum, count) => sum + count, 0)
              }})
            </div>
            <!-- Display items in this sub-category -->

            <!-- LOOP OVER ALL FURNI GROUPS (Individual items or recoulors) -->

            <div :key="subCategoryName">
              <div
                v-if="categoryState[subCategoryName]"
                class="grid grid-cols-1 gap-1 grid-container"
              >
                <div
                  v-for="(furniGroup, groupName) in itemGroups"
                  :key="groupName"
                  class="text-xs bg-black rounded-lg p-0.5"
                >
                  <!-- Get The First Item -->
                  <div
                    v-for="item in [furniGroup.items[0]]"
                    :key="item.classname"
                    :id="item.baseClassname"
                    class="grid grid-cols-2 items-center"
                  >
                    <!-- Added a wrapper for image and text -->
                    <div
                      v-if="item.name"
                      class="grid grid-cols-[50px,auto] pl-2 items-center"
                      :class="item.name.includes('_') ? 'text-red-100' : ''"
                    >
                      <furni-img
                        :classname="item.classname"
                        :alt="item.name"
                        v-bind="{ ['data-classname']: item.classname }"
                      ></furni-img>
                      <div class="text-xs capitalize font-bold">
                        {{ item.name }}
                      </div>
                    </div>
                    <!-- buttons -->
                    <div class="buttons text-right">
                      <button
                        v-if="furniGroup.items.length == 1"
                        @click="addToRoom(item.classname)"
                        class="bg-white text-center font-bold py-2 text-xs text-white leading-6 controller-button rounded-lg px-2"
                      >
                        Drop in Room
                      </button>
                      <button
                        :class="{ hidden: furniGroup.items.length > 1 }"
                        v-if="furniGroup.items.length > 1"
                        class="controller-button bg-white font-bold text-center py-2 text-xs text-white leading-6 controller-button rounded-lg px-2"
                      >
                        Drop in Room
                      </button>
                      <button
                        @click="openColors(groupName)"
                        v-if="
                          !showColors[groupName] && furniGroup.items.length > 1
                        "
                        class="bg-white font-bold text-center py-2 text-xs text-white leading-6 controller-button rounded-lg px-2"
                      >
                        Select Color
                      </button>
                    </div>
                  </div>

                  <!-- Loop over the items in this group -->
                  <div
                    v-if="furniGroup.items.length > 1"
                    class="col-span-2 gap-0.5 flex flex-wrap items-center justify-center"
                  >
                    <template v-if="showColors[groupName]">
                      <div class="mt-2 items-center grid grid-cols-8 gap-1">
                        <!-- Added a wrapper for colors -->
                        <div v-for="item in furniGroup.items" class="text-xs">
                          <button
                            :style="{
                              backgroundColor: notWhite(item.partcolors.color),
                            }"
                            class="relative h-[42px] min-w-[44px] overflow-hidden rounded-xl border border-1 border-opacity-10 border-white active:brightness-125"
                            @click="
                              selectColor(
                                item,
                                item.partcolors.color[1],
                                $event
                              )
                            "
                          >
                            <div
                              class="w-5/6 mx-auto absolute top-0 bg-white bg-opacity-20 h-[3px] rounded-full mt-[0px] pointer-events-none"
                            ></div>
                          </button>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="text-center text-white text-xs mt-96">
          Total Items: {{ totalItemCount }}
        </div>
      </div>
    </div>
  </vue-bottom-sheet>
</template>

<script>
import axios from "axios";
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import { EventBus } from "@/eventBus";

export default {
  name: "FurniCatalog",
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      catalog: [],
      selectedColor: {},
      showCatalog: false,
      listeners: [],
      categoryState: {},
      showColors: {},
    };
  },
  components: {
    VueBottomSheet,
  },
  async created() {
    await this.fetchCatalogData();
    EventBus.$on("item-catalog", () => {
      this.showCatalog = true;
      setTimeout(() => {
        this.openCatalog();
      }, 100);
    });
  },
  computed: {
    filteredCatalog() {
      return this.catalog;
    },
    totalItemCount() {
      return this.catalog.length;
    },
    categorizedItems() {
      const categories = {
        Classic: {},
        Collections: {},
        Themed: {},
        Gaming: {},
        Miscellaneous: {},
        "Event-based": {},
        Uncategorized: {},
      };

      const categoryMapping = this.getCategoryMapping();

      this.filteredCatalog.flat().forEach((item) => {
        let itemCategory = "Uncategorized";

        if (item.classname.includes("clothing_")) {
          return; // skip clothing items
        }

        Object.keys(categoryMapping).forEach((category) => {
          if (categoryMapping[category].includes(item.furniline)) {
            itemCategory = category;
          }
        });

        if (!categories[itemCategory][item.furniline]) {
          categories[itemCategory][item.furniline] = {}; // Initialize empty object
        }

        const groupKey = this.createGroupKey(item.classname);

        if (!categories[itemCategory][item.furniline][groupKey]) {
          categories[itemCategory][item.furniline][groupKey] = {
            items: [],
          }; // Initialize with items and colors arrays
        }

        categories[itemCategory][item.furniline][groupKey].items.push(item);
      });

      return categories;
    },
  },
  watch: {
    searchQuery: {
      handler(query) {
        if (query.length > 2) {
          this.triggerBrowserFind();
        }
      },
      immediate: false,
    },
  },
  methods: {
    notWhite(color) {
      for (let i = 0; i < color.length; i++) {
        color[i] = color[i].toLowerCase();
        if (color[i] != "#ffffff") {
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
        console.error("Unable to open catalog:", error);
      }
    },
    closeCatalog() {
      this.$refs.catalogSheet.close();
    },
    triggerBrowserFind() {
      if (window.find && this.searchQuery.length > 2) {
        window.find(this.searchQuery);
      } else {
        alert("Built-in Find is not supported in this browser");
      }
    },
    addToRoom(classname) {
      this.$root.$emit("add-to-room", classname);
    },
    replaceAsteriskWithUnderscore(classname) {
      const match = classname.match(/\*(\d+)$/);
      return match ? classname.replace(/\*(\d+)$/, "_" + match[1]) : classname;
    },
    selectColor(item, color) {
      this.selectedColor = { item, color };

      //Update the image where id = item.classname img
      let baseClassname = item.baseClassname;
      const parentElement = document.getElementById(baseClassname);
      const furniImgComponent = parentElement.querySelector("img");
      //Refactor this to use the FurniImg component
      furniImgComponent.src = `https://ducket-net.github.io/resources/icons/${this.replaceAsteriskWithUnderscore(
        item.classname
      )}_icon.png`;

      const addToRoomButton = parentElement.querySelector(".controller-button");
      //Add Class
      addToRoomButton.classList.remove("hidden");

      // Remove the old event listener if there is one
      if (this.listeners[item.baseClassname]) {
        addToRoomButton.removeEventListener(
          "click",
          this.listeners[item.baseClassname]
        );
      }

      // Define the new event listener
      const newListener = () => {
        this.addToRoom(item.classname);
      };

      // Add the new event listener
      addToRoomButton.addEventListener("click", newListener);

      // Store the new event listener for the given classname
      this.listeners[item.baseClassname] = newListener;
    },
    createGroupKey(classname) {
      if (!classname) {
        return "";
      }

      let key = classname
        .replace(/\*\d+$/, "") // Remove *1, *2, etc., from the classname
        .trim();

      return key.toLowerCase();
    },
    replaceUnderscoreWithAsterisk(classname) {
      const match = classname.match(/_(\d+)$/);
      return match ? classname.replace(/_(\d+)$/, "*" + match[1]) : classname;
    },

    removeAsteriskFromClassName(classname) {
      return classname.replace(/\*\d+$/, "");
    },
    getCategoryMapping() {
      return {
        Classic: [
          "iced",
          "mode",
          "plasto",
          "rugs",
          "legacy",
          "lodge",
          "pura",
          "plants",
          "extras",
        ],
        "Event-based": [
          "valentine_2013",
          "valentine_2014",
          "valentine_2015",
          "valentine_2016",
          "valentine_2018",
          "valentine_2019",
          "valentine_2020",
          "valentine_2021",
          "valentine_2022",
          "valentine_2011",
          "st_patricks",
          "easter_2011",
          "easter_2013",
          "easter_2014",
          "easter_2016",
          "easter_2017",
          "easter_2018",
          "easter_2019",
          "easter_2020",
          "easter_2021",
          "easter_2022",
          "easter_2023",
          "habboween_2009",
          "habboween_2011",
          "habboween_2012",
          "habboween_2013",
          "habboween_2014",
          "habboween_2015",
          "habboween_2016",
          "habboween_2017",
          "habboween_2018",
          "habboween_2019",
          "habboween_2020",
          "habboween_2021",
          "habboween_2022",
          "habboween",
          "xmas2009",
          "xmas2010",
          "xmas2010_quest_items",
          "xmas2011",
          "xmas2012",
          "xmas2013",
          "xmas2014",
          "xmas2015",
          "xmas2016",
          "xmas2017",
          "xmas2018",
          "xmas2019",
          "xmas2020",
          "xmas2021",
          "xmas2022",
          "xmas_c17_man",
          "newyear_2015",
          "newyear_2016",
          "newyear_2017",
          "newyear_2018",
          "newyear_2019",
          "newyear_2020",
          "newyear_2021",
          "newyear_2022",
          "newyear_2023",
        ],
        Themed: [
          "bedroom",
          "kitchen",
          "baths",
          "dining_room",
          "garden",
          "office",
          "household",
          "hotel",
          "supermarket",
          "boutique",
          "cafe",
          "home_cinema",
          "sports",
          "asian",
          "african",
          "greek",
          "vikings",
          "art",
          "classics",
          "glass",
          "gothic",
          "scifi",
          "tiki",
          "antique",
          "jungle",
          "area",
          "paris",
          "sunsetcafe",
          "india",
          "sanrio",
          "greek",
        ],
        Collections: [
          "rare",
          "nft",
          "collectibles",
          "classics",
          "trophies",
          "buildersclub",
          "buildersclub_alpha1",
          "bonusrare",
          "credit_furni",
          "diamond",
          "habbo_club_gifts",
          "specialtype",
          "excludeddynamic",
        ],
        Gaming: ["wired", "arcade", "snowboard", "gambling", "football"],
        Miscellaneous: ["testing", "undefined", "military", "animals"],
      };
    },
    async fetchCatalogData() {
      try {
        // Fetch the catalog data from Laravel API
        const response = await axios.get(
          `${process.env.VUE_APP_DUCKET_URL}/api/catalog`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              Accept: "application/json",
              ContentType: "application/json",
            },
            body: {},
          }
        );

        // Set the catalog, lines, and categories from the response
        this.catalog = response.data.catalog;
        this.lines = response.data.lines;
        this.categories = response.data.categories;
      } catch (error) {
        console.error("Unable to fetch catalog data:", error);
      }
    },
    async fetchAndParseXML() {
      try {
        const dbName = "furnidataDB";
        const storeName = "furnidataStore";
        const id = 1;
        let xmlData;
        const refreshTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const request = indexedDB.open(dbName);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          // eslint-disable-next-line no-unused-vars
          const furnidataStore = db.createObjectStore(storeName, {
            keyPath: "id",
          });
        };

        request.onsuccess = async (event) => {
          const db = event.target.result;

          const transaction = db.transaction([storeName]);
          const objectStore = transaction.objectStore(storeName);
          const dataRequest = objectStore.get(id);

          // eslint-disable-next-line no-unused-vars
          dataRequest.onsuccess = async (event) => {
            const now = Date.now();
            const shouldFetch =
              dataRequest.result === undefined ||
              now - dataRequest.result.timestamp >= refreshTime;

            if (!shouldFetch) {
              xmlData = dataRequest.result.value;
            } else {
              // Fetch the data from the server if not present in IndexedDB or older than 24 hours
              const response = await axios.get(
                "https://ducket-net.github.io/resources/furnidata.xml"
              );
              xmlData = response.data;

              // Store the fetched data in IndexedDB
              const updateData = { id, value: xmlData, timestamp: now };
              const putRequest = db
                .transaction([storeName], "readwrite")
                .objectStore(storeName)
                .put(updateData);

              putRequest.onerror = (event) => {
                console.error(
                  "Error storing the data in IndexedDB:",
                  event.target.error
                );
              };
            }

            this.parseXMLAndCreateCatalogItems(xmlData);
          };
        };

        request.onerror = (event) => {
          console.error("Error opening the IndexedDB:", event.target.error);
        };
      } catch (error) {
        console.error("Unable to fetch XML data:", error);
      }
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
