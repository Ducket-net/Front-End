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
        <strong>Categories:</strong>
        <div
          v-for="(categoryItems, categoryName) in categorizedItems"
          :key="categoryName"
          class="text-xs"
        >
          <div class="text-white bg-red-500 p-2 rounded-lg mb-1">
            {{ categoryName }}
          </div>
          <div class="grid grid-cols-2 gap-1">
            <div
              v-for="catItem in categoryItems"
              :key="catItem.id"
              class="text-xs bg-gray-800 rounded p-1"
            >
              <div class="text-xs">
                <div class="text-xs font-bold">
                  {{ catItem.name }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ catItem.description }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ catItem.furniline }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ catItem.revision }}
                </div>
                <div class="text-xs text-gray-400">
                  {{ catItem.category }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="mt-4 mb-2 col-span-2"> -->
      <!-- <div>
          <strong>Lines:</strong>
          <div
            v-for="(count, furniline) in sortedItemCountByLine"
            :key="furniline"
            class="ml-2 text-xs"
          >
            {{ furniline }}: {{ count }}
          </div>
        </div> -->
      <!-- <div>
          <strong>Revisions:</strong>
          <div
            v-for="(count, revision) in sortedItemCountByRevision"
            :key="revision"
            class="ml-2 text-xs"
          >
            {{ revision }}: {{ count }}
          </div>
        </div> -->
      <!-- <div>
          <strong>Categories:</strong>
          <div
            v-for="(count, category) in sortedItemCountByCategory"
            :key="category"
            class="ml-2 text-xs"
          >
            {{ category }}: {{ count }}

            <div class="grid grid-cols-5"></div>
          </div>
        </div> -->
      <!-- </div> -->

      <!-- <div
        v-for="item in filteredItems"
        :key="item.id"
        class="flex min-h-[42px] items-center px-2 bg-black rounded cursor-pointer hover:bg-black"
        @click.stop="addToRoom(item.classname)"
      >
        <div class="text-xs">
          <div class="text-xs">
            {{ item.name }}
          </div>
          <div class="text-xs text-gray-400">
            {{ item.furniline }}
          </div>
          <div class="text-xs text-gray-400">
            {{ item.revision }}
          </div>
          <div class="text-xs text-gray-400">
            {{ item.category }}
          </div>
          <div class="text-xs text-gray-400">
            {{ item.description }}
          </div>
        </div>
      </div> -->
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
    categorizedItems() {
      const categories = {
        "Event-based": [],
        "Themed furniture": [],
        Collections: [],
        Gaming: [],
        Miscellaneous: [],
      };

      this.catalog.forEach((item) => {
        // Event-based lines
        if (
          [
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
          ].includes(item.furniline)
        ) {
          categories["Event-based"].push(item);
        }
        // Themed furniture lines
        else if (
          [
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
          ].includes(item.furniline)
        ) {
          categories["Themed furniture"].push(item);
        }
        // Collection lines
        else if (
          [
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
          ].includes(item.furniline)
        ) {
          categories["Collections"].push(item);
        }
        // Gaming lines
        else if (
          ["wired", "arcade", "snowboard", "gambling", "football"].includes(
            item.furniline
          )
        ) {
          categories["Gaming"].push(item);
        }
        // Miscellaneous lines
        else if (
          [
            "testing",
            "partcolors",
            "undefined",
            "military",
            "animals",
          ].includes(item.furniline)
        ) {
          categories["Miscellaneous"].push(item);
        }
        // Add an extra condition for any uncategorized lines, put them into a "new" category
        else {
          if (!categories["Uncategorized"]) {
            categories["Uncategorized"] = [];
          }
          categories["Uncategorized"].push(item);
        }
      });

      return categories;
    },
    sortedItemCountByLine() {
      return this.sortByCount(this.itemCountByLine());
    },
    sortedItemCountByRevision() {
      return this.sortByCount(this.itemCountByRevision());
    },
    sortedItemCountByCategory() {
      return this.sortByCount(this.itemCountByCategory());
    },
    // other computed properties...

    filteredItems() {
      if (this.searchQuery === "") return this.catalog;
      if (this.searchResults.length > 0) {
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
          this.filterCatalogItems(query);
        }
      },
      immediate: false,
    },
  },
  methods: {
    itemCountByLine() {
      const lineCounts = {};
      this.catalog.forEach((item) => {
        const furniline = item.furniline;
        if (!lineCounts[furniline]) {
          lineCounts[furniline] = 0;
        }
        lineCounts[furniline]++;
      });
      return lineCounts;
    },
    itemCountByRevision() {
      const revisionCounts = {};
      this.catalog.forEach((item) => {
        const revision = item.revision;
        if (!revisionCounts[revision]) {
          revisionCounts[revision] = 0;
        }
        revisionCounts[revision]++;
      });
      return revisionCounts;
    },
    itemCountByCategory() {
      const categoryCounts = {};
      this.catalog.forEach((item) => {
        const category = item.category;
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category]++;
      });
      return categoryCounts;
    },
    sortByCount(itemCounts) {
      return Object.entries(itemCounts)
        .sort((a, b) => b[1] - a[1])
        .reduce((accumulator, currentValue) => {
          accumulator[currentValue[0]] = currentValue[1];
          return accumulator;
        }, {});
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

      this.catalog = furnitypes.map((furnitype) => ({
        id: furnitype._attributes.id,
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
      }));
    },
    filterCatalogItems(query) {
      this.searchResults = this.catalog.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    addToRoom(classname) {
      console.log("Add to room", classname);
      this.$root.$emit("add-to-room", classname);
    },
  },
};
</script>
