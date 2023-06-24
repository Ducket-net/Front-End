// src/main.js
import Vue from 'vue';
import App from './App.vue';
import store from './store'; // Make sure you import the store
import router from './router'; // Import the router
import './tailwind.css';
import { FontAwesomeIcon } from './fontAwesome'; // Import the FontAwesomeIcon component
import Vue2TouchEvents from 'vue2-touch-events';
import FurniImg from './components/FurniImg.vue';
import './services/authMixin';
import DebouncedOnClick from './services/debounceAction.js';
import utils from './utils';

// eslint-disable-next-line no-unused-vars
import { debounce } from 'lodash';

Vue.component('font-awesome-icon', FontAwesomeIcon); // Register the FontAwesomeIcon globally
Vue.component('furni-img', FurniImg);
Vue.use(utils);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  store,
  router,
  mixins: [DebouncedOnClick],
  Vue2TouchEvents,
  render: (h) => h(App),
});
