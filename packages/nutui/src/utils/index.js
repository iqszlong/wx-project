import lazyUtils from "@lazy/utils"; // 通用工具库
import wxUtils from "@lazy/utils-wx"; // 微信相关工具
import * as request from "./request"; // 请求
import * as router from "./router"; // 路由跳转
import * as user from "./user"; // 用户相关
import * as state from "./state"; // 状态
import * as order from "./order"; // 订单
import * as day from "./dayjs"; // 日期库
import * as global from "./global"; // 公共变量
export default {
  request,
  router,
  user,
  order,
  state,
  day,
  global,
  ...lazyUtils,
  ...wxUtils,
};
