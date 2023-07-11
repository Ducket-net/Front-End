// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import RoomPage from '@/pages/RoomPage.vue';
import GameRoom from '../components/GameRoom.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import Dashboard from '../pages/static/Dashboard.vue';
import Login from '@/pages/LoginPage.vue';
import AuthCallback from '@/pages/AuthCallback.vue';
import SpeechPage from '@/pages/SpeechPage.vue';
import GamePage from '@/pages/GamePage.vue';
import SmallRoomPage from '@/pages/SmallRoomPage.vue';
import FeedPage from '@/pages/Feed/FeedPage.vue';
import CatalogListItems from '@/pages/Catalog/ListItems.vue';
import CatalogSink from '@/pages/Catalog/CatalogPage.vue';
import Page from '@/pages/Page.vue';
import Wired from '@/pages/Wired.vue';
import DynamicComponentLoader from '@/pages/DynamicComponentLoader.vue';
import CollectCatalog from '@/pages/static/CollectCatalog.vue';

const routes = [
  {
    path: '/',
    name: 'Homepage',
    component: CollectCatalog, // Set the home component for the root URL
    meta: {
      title: 'Mobile Pixel Companion',
    },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard, // Set the home component for the root URL
  },
  {
    path: '/catalog-sink',
    name: 'Catalog Sink',
    component: CatalogSink, // Set the home component for the root URL
    meta: {
      title: 'Kitchen Sink',
    },
  },
  { path: '/wired', component: Wired, name: 'Wired', meta: { title: 'Wired' } },

  {
    path: '/list',
    name: 'List',
    component: CatalogListItems, // Set the home component for the root URL
  },
  {
    path: '/game',
    name: 'Game',
    component: GamePage, // Set the home component for the root URL
  },
  {
    path: '/feed',
    name: 'Feed',
    component: FeedPage, // Set the home component for the root URL
  },
  {
    path: '/create',
    name: 'Create',
    component: RoomPage, // Set the home component for the root URL
  },
  {
    path: '/createSmall',
    name: 'Create Small Room',
    component: SmallRoomPage, // Set the home component for the root URL
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: CatalogPage, // Set the home component for the root URL
  },
  {
    path: '/room/:id', // Add the dynamic :id parameter
    name: 'GameRoom',
    component: GameRoom,
  },
  { path: '/login', component: Login },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/auth/discord/callback', component: AuthCallback },
  { path: '/speech', name: 'SpeechPage', component: SpeechPage },
  { path: '/:componentName(.*)', component: DynamicComponentLoader },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
  },
});

router.beforeEach((to, from) => {
  let title = 'Ducket - ' + to.meta?.title ?? to.name;
  document.title = title;
});

export default router;
