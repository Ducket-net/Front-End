<template>
  <div
    ref="catalog"
    class="overflow-hidden bg-black bg-opacity-50 shadow-md p-4 text-white"
  >
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

    <div
      class="p-0.5 mt-2 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-200px)] no-scrollbar"
    >
      <div>
        <strong>Categories ({{ totalItemCount }})</strong>
        <div
          v-for="(subCategories, categoryName) in categorizedItems"
          :key="categoryName"
          class="text-xs mb-2"
        >
          <div class="text-white bg-red-500 p-2 rounded-lg mb-1">
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
          <div
            v-for="(itemGroups, subCategoryName) in subCategories"
            :key="subCategoryName"
            class="mb-2"
          >
            <div class="text-xs font-bold bg-blue-300 p-2 rounded-lg">
              {{ subCategoryName }} ({{
                Object.values(itemGroups)
                  .map((group) => group.items.length)
                  .reduce((sum, count) => sum + count, 0)
              }})
            </div>
            <!-- Display items in this sub-category -->
            <div
              class="grid grid-cols-4 items-baseline gap-1 overflow-hidden hover:overflow-y-auto hover:max-h-96"
            >
              <div
                v-for="(itemsWithColors, groupName) in itemGroups"
                :key="groupName"
              >
                <div
                  v-for="item in [itemsWithColors.items[0]]"
                  :key="item.classname"
                  class="text-xs ml-2 bg-gray-700 rounded-lg p-1"
                >
                  <div
                    class="text-xs capitalize font-bold"
                    v-if="item.name"
                    :class="item.name.includes('_') ? 'text-red-500' : ''"
                  >
                    <img :src="imageSrc(item)" :alt="item.name" />
                    <div v-if="itemsWithColors.colors.length">
                      <div
                        v-for="(color, colorIndex) in getUniqueColors(
                          itemsWithColors.colors
                        )"
                        :key="`${colorIndex}-${color}`"
                        :style="{ backgroundColor: color }"
                        class="w-3 h-3 inline-block mr-1 rounded-full"
                      ></div>
                    </div>
                    {{ item.name }}
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
    };
  },
  created() {
    this.fetchAndParseXML();
  },
  computed: {
    filteredCatalog() {
      if (!this.searchQuery || this.searchQuery.length <= 2) {
        return this.catalog;
      }

      return this.catalog.filter((item) =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
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

        const groupKey = this.createGroupKey(item.name);

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
          this.filterCatalogItems(query);
        }
      },
      immediate: false,
    },
  },
  methods: {
    getUniqueColors(colors) {
      const uniqueColors = Array.from(new Set(colors));
      return uniqueColors;
    },
    createGroupKey(name) {
      if (!name) {
        return "";
      }

      const colors = [
        "rose gold",
        "maroon",
        "fire",
        "bronze",
        "elf",
        "teal",
        "black",
        "white",
        "pink",
        "blue",
        "red",
        "duck blue",
        "diamond",
        "green",
        "yellow",
        "orange",
        "purple",
        "brown",
        "sky",
        "choco",
        "fire",
        "ocra",
        "gold",
        "silver",
        "Fucsia",
        "graphite",
        "khaki",
        "golden",
        "spinel",
        "jasper",
        "turquoise",
        "berry",
        "aquamarine",
        "cirtine",
        "turquoise",
        "pearl",
        "peach",
        "grassy",
        "sandy",
        "grey",
        "copper",
        "platinum",
        "navy",
        "knight",
        "white",
        "Rainbow",
        "sea",
        "emerald",
        "ruby",
        "sapphire",
        "topaz",
        "amethyst",
        "jade",
        "fucia",
        "ochre",
        "lime",
        "granite",
        "ocean",
        "army",
        "rural",
        "urban",
        "aqua",
      ];
      const colorRegExPattern = new RegExp(
        "\\b(?:" + colors.join("|") + ")\\b",
        "gi"
      );
      let key = name
        .replace(colorRegExPattern, "")
        .replace(/\s*,\s*/g, " ")
        .trim();

      return key.toLowerCase();
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
    imageSrc(item) {
      const cleanedClassname = item.classname.replace("*", "_");
      return `https://ducket.net/assets/furni/${cleanedClassname}_icon.png`;
    },
    async fetchAndParseXML() {
      try {
        const response = await axios.get(
          "https://ducket-net.github.io/resources/furnidata.xml"
        );
        const xmlData = response.data;
        this.parseXMLAndCreateCatalogItems(xmlData);
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
            partcolors = furnitype.partcolors.color.map((color) => color._text);
          }
          // If color is a single object
          else {
            partcolors = [furnitype.partcolors.color._text];
          }
        }
        return {
          partcolors,
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
    addToRoom(classname) {
      console.log("Add to room", classname);
    },
  },
};
</script>
