// src/router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "../components/HomeView.vue";
import GameRoom from "../components/GameRoom.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: HomeView, // Set the home component for the root URL
    },
    {
        path: "/room/:id", // Add the dynamic :id parameter
        name: "GameRoom",
        component: GameRoom,
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

export default router;
