import { createApp } from "vue";
import App from "./App.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

console.log(dayjs.duration(60, "seconds").format("mm:ss"));
createApp(App).mount("#app");
