import {
  Router,
  NavigateType,
  registerMiddlewares,
  registerRouterBackListener,
} from "tarojs-router-next"; // 路由库

import utils from ".";


const whiteList = ["index","login"];

// 跳转页面
const goPage = async (url, data = {}, fn) => {
  if (url == "" || url == undefined) {
    fn && fn();
    return;
  }
  // 路由文档
  // http://lblblib.gitee.io/tarojs-router-next/guide/quike/start
  return await Router.navigate(
    {
      url,
    },
    data
  );
};

// 重新进入某页面
const relaunch = (url) => {
  // console.log('relaunch',url);
  return Router.navigate({ url }, { type: NavigateType.reLaunch });
};

// 重启进入首页
const goHomeRelaunch = () => {
  return relaunch("/pages/index/index");
};

// 关闭当前页面，跳转到应用内的某个页面
const redirect = (url, data) => {
  return Router.navigate({ url }, { ...data, type: NavigateType.redirectTo });
};

// 返回
const goBack = () => {
  return Router.back();
};

// 路由数据
const getData = () => Router.getData();

// 路由参数
const getParams = () => Router.getParams();


// 中间件
const Logger = async (ctx, next) => {
  // console.log("第一个中间件执行：", ctx.route.url);
  const pageName = ctx.route.url.split("/")[1];
  if (!utils.wxLogin.hasToken() && !whiteList.includes(pageName)) {
    goPage("/pages/login/index");
    return;
  }
  await next(); // 执行下一个中间件
};

// 中间件 获取用户数据
const UserData = async (ctx, next) => {
  // console.log("第二个中间件执行：", ctx.route.url);
  if (utils.wxLogin.hasToken()) {
    utils.user.getUserData();
  }
  await next(); // 执行下一个中间件
};

registerMiddlewares([Logger, UserData]);

// 路由回退监听
registerRouterBackListener((to, from) => {
  // console.log(`全局监听页面返回：从 ${from.url} 返回到 ${to.url}`)
  // 退出或进入到超市页面
  // if (from.url == "/pages/market/index" || to.url == "/pages/market/index") {
  //   utils.user.getUserData(true); // true 计算价格
  // }
});

export {
  goPage,
  goHomeRelaunch,
  relaunch,
  redirect,
  goBack,
  getData,
  getParams,
};
