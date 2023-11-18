import { createApp } from "vue";

// import nutui from "@/components/nutui";
// import { IconFont } from '@nutui/icons-vue-taro';
import { createPinia } from "pinia";
import components from "@/components/index";
// import lazywx from "@lazy/components-wx";
import eventBus from "vue3-eventbus";
import utils from "@/utils/index";
import { setGlobalDataPlugin } from "@tarojs/taro";

import "./app.scss";
// 图标
import "@/assets/styles/remixicon.css";

const App = createApp({
  // 可以使用所有的 Vue 生命周期方法
  mounted() {},

  // 对应 onLaunch
  onLaunch() {
    // 应用启动 获取用户数据
    const hasToken = utils.wxLogin.hasToken();
    if (hasToken) utils.user.getUserData();
  },

  // 对应 onShow
  onShow(options) {},

  // 对应 onHide
  onHide() {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
});

App.use(createPinia())
  .use(components)
  //.use(IconFont)
  // .use(lazywx)
  // .use(nutui)
  .use(eventBus)
  .use(setGlobalDataPlugin, { version: 1 }); // 公共变量;

export default App;
