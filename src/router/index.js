// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import RoomPage from '@/pages/RoomPage.vue';
import GameRoom from '../components/GameRoom.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import Login from '@/pages/LoginPage.vue';
import AuthCallback from '@/pages/AuthCallback.vue';
import SpeechPage from '@/pages/SpeechPage.vue';
import GamePage from '@/pages/GamePage.vue';
import SmallRoomPage from '@/pages/SmallRoomPage.vue';
import FeedPage from '@/pages/Feed/FeedPage.vue';
import CatalogListItems from '@/pages/Catalog/ListItems.vue';
import CatalogSink from '@/pages/Catalog/CatalogPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DashboardPage, // Set the home component for the root URL
  },
  {
    path: '/catalog-sink',
    name: 'Catalog Sink',
    component: CatalogSink, // Set the home component for the root URL
  },
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
  { path: '/speech', name: 'SpeechPage', component: SpeechPage },
  {
    path: '/*',
    component: DashboardPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
