// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import RoomPage from '@/pages/RoomPage.vue';
import GameRoom from '../components/GameRoom.vue';
import CatalogPage from '../pages/CatalogPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import Login from '@/pages/LoginPage.vue';
import AuthCallback from '@/pages/AuthCallback.vue';
import SpeechPage from '@/pages/SpeechPage.vue';
import GamePage from '@/pages/GamePage.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DashboardPage, // Set the home component for the root URL
  },
  {
    path: '/game',
    name: 'Game',
    component: GamePage, // Set the home component for the root URL
  },
  {
    path: '/create',
    name: 'Create',
    component: RoomPage, // Set the home component for the root URL
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

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
