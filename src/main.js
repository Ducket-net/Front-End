// src/main.js
import Vue from "vue";
import App from "./App.vue";
import store from "./store"; // Make sure you import the store
import router from "./router"; // Import the router
import "./tailwind.css";

new Vue({
    el: "#app",
    store,
    router,
    render: (h) => h(App),
});
