<template>
  <div ref="catalog" class="bg-black bg-opacity-50 shadow-md p-4 text-white">
    <div class="flex">
      <h3 class="flex-auto text-xs uppercase font-mono text-white mb-3">
        {{ searchQuery ? searchQuery : "Catalog" }}
      </h3>
    </div>

    <input
      type="text"
      v-model="searchQuery"
      placeholder="Search items..."
      class="p-2 w-full bg-gray-100 rounded text-black"
    />

    <div class="p-0.5 mt-2 overflow-y-auto overflow-x-hidden no-scrollbar">
      <div>
        <strong>Categories ({{ totalItemCount }})</strong>
        <!-- LOOP OVER ALL CATEGORIES -->
        <div
          v-for="(subCategories, categoryName) in categorizedItems"
          :key="categoryName"
          class="text-xs mb-2"
        >
          <div class="text-white bg-red-900 p-2 rounded-lg mb-1">
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
          <div
            v-for="(itemGroups, subCategoryName) in subCategories"
            :key="subCategoryName"
            class="mb-2"
          >
            <div class="text-xs font-bold bg-indigo-900 mb-1 p-2 rounded-lg">
              {{ subCategoryName }} ({{
                Object.values(itemGroups)
                  .map((group) => group.items.length)
                  .reduce((sum, count) => sum + count, 0)
              }})
            </div>
            <!-- Display items in this sub-category -->

            <!-- LOOP OVER ALL FURNI GROUPS (Individual items or recoulors) -->
            <div class="grid grid-cols-2 gap-1 grid-container">
              <div
                v-for="(furniGroup, groupName) in itemGroups"
                :key="groupName"
                class="text-xs bg-black rounded-lg py-4 px-2"
              >
                <!-- Get The First Item -->
                <div
                  v-for="item in [furniGroup.items[0]]"
                  :key="item.classname"
                >
                  <div
                    class="text-xs capitalize font-bold text-center"
                    v-if="item.name"
                    :id="item.strippedClassname"
                    :class="item.name.includes('_') ? 'text-red-500' : ''"
                  >
                    <img
                      class="mx-auto"
                      :src="`${item.image}`"
                      :alt="item.name"
                    />
                    <div class="py-2">{{ item.name }}</div>
                    <button
                      @click="addToRoom(item.classname)"
                      class="bg-white w-full text-center py-2 text-xs text-white my-2 leading-6 controller-button rounded-lg px-2"
                    >
                      Add to room
                    </button>
                  </div>
                </div>
                <!-- Loop over the items in this group -->
                <div
                  v-if="furniGroup.items.length > 1"
                  class="gap-0.5 flex flex-wrap items-center justify-center"
                >
                  <div
                    v-for="item in furniGroup.items"
                    :key="item.classname"
                    class="text-xs"
                  >
                    <div
                      :style="{ backgroundColor: item.partcolors[0] }"
                      class="h-[42px] flex-auto min-w-[44px] overflow-hidden rounded-xl border border-1 border-opacity-10 border-white active:brightness-125"
                      @click="selectColor(item, item.partcolors[0])"
                    >
                      <div
                        class="w-5/6 mx-auto bg-white bg-opacity-20 h-[3px] rounded-full mt-[0px] pointer-events-none"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import xml2js from "xml-js";

export default {
  name: "FurniCatalog",
  data() {
    return {
      searchQuery: "",
      searchResults: [],
      catalog: [],
      selectedColor: {},
    };
  },
  created() {
    this.fetchAndParseXML();
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
        "Event-based": {},
        Themed: {},
        Collections: {},
        Gaming: {},
        Miscellaneous: {},
        Uncategorized: {},
      };

      const categoryMapping = this.getCategoryMapping();

      this.filteredCatalog.forEach((item) => {
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
            colors: [],
          }; // Initialize with items and colors arrays
        }

        categories[itemCategory][item.furniline][groupKey].items.push(item);

        // Adds colors only if item.partcolors is present
        if (item.partcolors) {
          categories[itemCategory][item.furniline][groupKey].colors.push(
            ...item.partcolors
          );
        }
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
  // https://ducket.net/assets/furni/couch_norja_5_icon.png
  methods: {
    triggerBrowserFind() {
      if (window.find && this.searchQuery.length > 2) {
        window.find(this.searchQuery);
      } else {
        alert("Built-in Find is not supported in this browser");
      }
    },
    addToRoom(classname) {
      console.log("Add to room", classname);
      this.$root.$emit("add-to-room", classname);
    },
    selectColor(item, color) {
      this.selectedColor = { item, color };

      console.log("Select color", item.classname);
      console.log("Select color", item.strippedClassname);

      //Update the image where id = item.classname img
      const parentElement = document.getElementById(item.strippedClassname);
      const image = parentElement.querySelector("img");
      const addToRoomButton = parentElement.querySelector("button");
      addToRoomButton.addEventListener("click", () => {
        this.addToRoom(item.classname);
      });
      image.src = item.image;
    },
    getUniqueColors(colors) {
      const uniqueColors = Array.from(new Set(colors));
      return uniqueColors;
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
    replaceAsteriskWithUnderscore(classname) {
      const match = classname.match(/\*(\d+)$/);
      return match ? classname.replace(/\*(\d+)$/, "_" + match[1]) : classname;
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
          "collectibles",
          "classics",
          "trophies",
          "buildersclub",
          "buildersclub_alpha1",
          "nft",
          "rare",
          "bonusrare",
          "credit_furni",
          "diamond",
          "habbo_club_gifts",
          "specialtype",
          "excludeddynamic",
        ],
        Gaming: ["wired", "arcade", "snowboard", "gambling", "football"],
        Miscellaneous: [
          "testing",
          "partcolors",
          "undefined",
          "military",
          "animals",
        ],
      };
    },
    async fetchAndParseXML() {
      try {
        const dbName = "furnidataDB";
        const storeName = "furnidataStore";
        const id = 1;
        let xmlData;

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
            // Get data from IndexedDB if it exists
            if (dataRequest.result !== undefined) {
              xmlData = dataRequest.result.value;
            } else {
              // Fetch the data from the server if not present in IndexedDB
              const response = await axios.get(
                "https://ducket-net.github.io/resources/furnidata.xml"
              );
              xmlData = response.data;

              // Store the fetched data in IndexedDB
              const addRequest = db
                .transaction([storeName], "readwrite")
                .objectStore(storeName)
                .add({ id, value: xmlData });

              addRequest.onerror = (event) => {
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
    parseXMLAndCreateCatalogItems(xmlData) {
      const options = {
        compact: true,
        ignoreComment: true,
        alwaysChildren: true,
      };
      const parsedXML = xml2js.xml2js(xmlData, options);
      const furnitypes = parsedXML.furnidata.roomitemtypes.furnitype;

      this.catalog = furnitypes.map((furnitype) => {
        let partcolors = [];

        if (furnitype.partcolors && furnitype.partcolors.color) {
          // If color is an array
          if (Array.isArray(furnitype.partcolors.color)) {
            // Remove white color
            partcolors = furnitype.partcolors.color
              .map((color) => color._text)
              .filter((color) => color.toLowerCase() !== "#ffffff");
          }
          // If color is a single object
          else {
            // Check if the single object is not white color
            if (furnitype.partcolors.color._text.toLowerCase() !== "#ffffff") {
              partcolors = [furnitype.partcolors.color._text];
            }
          }
        }
        return {
          partcolors,
          strippedClassname: this.removeAsteriskFromClassName(
            furnitype._attributes.classname
          ),
          image: `https://ducket.net/assets/furni/${this.replaceAsteriskWithUnderscore(
            furnitype._attributes.classname
          )}_icon.png`,
          classname: furnitype._attributes.classname,
          revision: furnitype.revision._text,
          name: furnitype.name._text,
          furniline: furnitype.furniline._text,
          xdim: furnitype.xdim._text,
          ydim: furnitype.ydim._text,
          specialtype: furnitype.specialtype._text,
          description: furnitype.description._text,
          bc: furnitype.bc._text,
          canstandon: furnitype.canstandon._text,
          cansiton: furnitype.cansiton._text,
          canlayon: furnitype.canlayon._text,
          rare: furnitype.rare._text,
          category: furnitype.category._text,
          defaultdir: furnitype.defaultdir._text,
          buyout: furnitype.buyout._text,
          offerid: furnitype.offerid._text,
          excludeddynamic: furnitype.excludeddynamic._text,

          // <category>shelf</category>
          // <defaultdir>0</defaultdir>
          // <xdim>1</xdim>
          // <ydim>1</ydim>
          // <partcolors>
          // <color>#ffffff</color>
          // <color>#F7EBBC</color>
          // </partcolors>
          // <name>Bookcase</name>
          // <description>For nic naks and art deco books</description>
          // <adurl/>
          // <offerid>5</offerid>
          // <buyout>1</buyout>
          // <rentofferid>-1</rentofferid>
          // <rentbuyout>0</rentbuyout>
          // <bc>1</bc>
          // <excludeddynamic>0</excludeddynamic>
          // <customparams/>
          // <specialtype>1</specialtype>
          // <canstandon>0</canstandon>
          // <cansiton>0</cansiton>
          // <canlayon>0</canlayon>
          // <furniline>iced</furniline>
          // <environment/>
          // <rare>0</rare>
          // </furnitype>

          // Include other properties you're interested in
        };
      });
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
