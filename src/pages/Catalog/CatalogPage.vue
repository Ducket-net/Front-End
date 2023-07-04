<template>
  <div>
    <h1>Catalog</h1>
    <div v-for="category in catalog" :key="category.id">
      <h2>{{ category.name }}</h2>
      <p>{{ category.description }}</p>
      <div v-for="item in category.items" :key="item.id">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <div
          class="border-black border-1 bg-cover bg-center text-white p-1 rounded-md flex flex-col justify-between active:shadow-xl"
          style="
            background-image: url('icons/plasto.png');
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: left;
          "
        >
          <div class="bg-white text-black p-1 rounded bg-opacity-30"></div>
          <div class="flex">
            <div
              class="grid grid-cols-2 justify-between text-black p-1 rounded"
            >
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                <h2 class="text-sm font-bold shadow-xl">Plasto</h2>
                <p class="text-xs text-gray-300">Chair for your room</p>
              </div>
            </div>
            <div
              class="flex-col justify-between h-8 flex-grow flex items-end space-y-1"
            >
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                Time: 1h
              </div>
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                Category: Chair
              </div>
            </div>
          </div>
        </div>

        <div class="catalog-list catalog-list-grid">
          <li
            class="flex items-center space-x-1 text-sm text-black bg-white rounded-md p-2 px-3"
          >
            <div
              class="flex-shrink border-r border-white p-1 border-opacity-20"
            >
              <img
                src="icons/Plasto_PodAnim.gif"
                alt="Wood"
                class="mx-auto object-contain"
              />
            </div>
            <div>
              <span>Plastic Pod</span>
            </div>
          </li>
          <li
            class="flex items-center space-x-1 text-sm text-black bg-white rounded-md p-2 px-3"
          >
            <div class="border-r border-white p-1 border-opacity-20">
              <img
                src="icons/plasto_table.gif"
                alt="Wood"
                class="object-contain"
              />
            </div>
            <div>
              <span>Plastic Pod</span>
            </div>
          </li>
          <li
            class="flex items-center space-x-1 text-sm text-black bg-white rounded-md p-2 px-3"
          >
            <div class="border-r border-white p-1 border-opacity-20">
              <img
                src="icons/Cland_c15_wall.png"
                alt="Wood"
                class="object-contain"
              />
            </div>
            <div>
              <span>Fucking Tree</span>
            </div>
          </li>
          <li
            class="flex items-center space-x-1 text-sm text-black bg-white rounded-md p-2 px-3"
          >
            <div class="border-r border-white p-1 border-opacity-20">
              <img src="icons/tree.gif" alt="Wood" class="object-contain" />
            </div>
            <div>
              <span>Fucking Tree</span>
            </div>
          </li>
          <li
            class="flex items-center space-x-1 text-sm text-black bg-white rounded-md p-2 px-3"
          >
            <div class="border-r border-white p-1 border-opacity-20">
              <img
                src="icons/Background_Mountains.png"
                alt="Wood"
                class="object-contain"
              />
            </div>
            <div>
              <span>Fucking Tree</span>
            </div>
          </li>
        </div>
      </div>

      <div>
        <div
          class="border-black border-1 bg-cover bg-center text-white p-1 rounded-md flex flex-col justify-between active:shadow-xl"
          style="background-image: url('icons/petal_800.gif')"
        >
          <div class="bg-white text-black p-1 rounded bg-opacity-30"></div>
          <div class="flex">
            <div
              class="grid grid-cols-2 justify-between text-black p-1 rounded"
            >
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                <h2 class="text-sm font-bold shadow-xl">Chairs</h2>
                <p class="text-xs text-gray-300">Chair for your room</p>
              </div>
            </div>
            <div
              class="flex-col justify-between h-8 flex-grow flex items-end space-y-1"
            >
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                Time: 1h
              </div>
              <div
                class="backdrop-blur-md bg-black/50 text-white p-1 px-2 rounded-md text-xs"
              >
                Category: Chair
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Catalog -->
  <!-- [
	{
		"id": 1,
		"name": "Chairs",
		"description": "Chairs for your room",
		"styles": [
			"bg-color-500",
			"text-white"
		],
		"assets": {
			"thumbnail": "https:\/\/example.com\/images\/category-chairs.png",
			"banner": "https:\/\/example.com\/images\/category-chairs-banner.png"
		},
		"filter": {
			"attribute": "category",
			"value": "chair"
		}
	}
] -->
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      catalog: [],
    };
  },
  async created() {
    //Axios
    try {
      const catalogResponse = await axios.get(
        'http://localhost:8000/api/mocks/catalog'
      );
      const catalog = catalogResponse.data;

      for (const category of catalog) {
        const itemsResponse = await axios.get(
          'http://localhost:8000/api/mocks/catalog/items',
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filter: category.filter }),
          }
        );
        const items = itemsResponse.data;
        category.items = items;
      }

      this.catalog = catalog;
    } catch (error) {
      console.error('Error fetching catalog data:', error);
    }
  },
};
</script>

<style>
.catalog-list-grid div img {
  margin: 0;
  padding: 0;

  border: 0;

  margin: auto;
  display: block;
  object-fit: contain;
}

.catalog-list-grid {
  column-count: 2;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  grid-gap: 1rem;
}
.catalog-list-grid li {
  display: inline-block;
  width: 100%;
  margin: 2px;
  text-align: center;
}
</style>
