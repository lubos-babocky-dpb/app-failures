import { createApp } from "vue";
import App from "./modular/App.vue";
import { Gatekeeper } from "@dpb/gatekeeper";
import router from "./modular/router.js";
import { i18n } from "./modular/i18n.js";

Gatekeeper.setBaseUrl('http://localhost/');

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount('#app');
