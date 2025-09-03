import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
/* Font Awesome */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* Solid icons */
import {
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

/* Brand icons */
import {
  faFacebookF,
  faInstagram,
  faLine,
} from "@fortawesome/free-brands-svg-icons";

library.add(
  faPhone,
  faEnvelope,
  faMapMarkerAlt,
  faFacebookF,
  faInstagram,
  faLine
);

const app = createApp(App);
app.use(router);
app.mount("#app");
app.component("FontAwesomeIcon", FontAwesomeIcon); // 全域註冊
