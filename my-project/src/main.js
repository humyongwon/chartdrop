// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";

import App from "./App";
import router from "./router";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";

import axios from "axios";

Vue.config.productionTip = false;
// 全局挂载axios
Vue.prototype.$axios = axios;

Vue.use(Antd);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  axios,
  components: { App },
  template: "<App/>",

  // v-charts
  render: h => h(App)
});
