import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router/router";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import queryClient from "@/integrations/tanstackQuery";

createApp(App)
    .use(createPinia())
    .use(router)
    .use(VueQueryPlugin, { queryClient })
    .mount("#app");
