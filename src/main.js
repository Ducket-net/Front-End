/* eslint-disable vue/multi-word-component-names */
// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import store from './store'; // Make sure you import the store
import router from './router'; // Import the router
import './tailwind.css';
import { FontAwesomeIcon } from './fontAwesome'; // Import the FontAwesomeIcon component

import FurniImg from './components/FurniImg.vue';
import './services/authMixin';
import DebouncedOnClick from './services/debounceAction.js';
import utils from './utils';
import { createBottomSheet } from 'bottom-sheet-vue3';
import '@webzlodimir/vue-bottom-sheet/dist/style.css';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import Page from '@/pages/Page.vue';

// eslint-disable-next-line no-unused-vars
import { debounce } from 'lodash';
import 'bottom-sheet-vue3/style.css';

const app = createApp(App);

app.component('font-awesome-icon', FontAwesomeIcon); // Register the FontAwesomeIcon globally
app.component('furni-img', FurniImg);
app.use(utils);
app.use(createBottomSheet());
app.use(StoryblokVue, {
  accessToken: 'WkRgNiIwY0CCeaNayHFj1Att',
  bridge: process.env.NODE_ENV !== 'production', // optimizes by excluding the bridge on production
  use: [apiPlugin],
});

app.config.productionTip = false;

app.mixin(DebouncedOnClick);

app.use(store);
app.use(router);

//Storyblok
app.component('Page', Page);

app.mount('#app');
