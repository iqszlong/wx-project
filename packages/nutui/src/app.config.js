export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/category/index",
    "pages/find/index",
    "pages/cart/index",
    "pages/my/index",
  ],
  subpackages: [
    {
      root: "system",
      name: "system",
      pages: [
        "pages/login/index",
        "pages/notfind/index",
      ],
    },
    {
      root: "shop",
      name: "shop",
      pages: [
        "pages/market/index",
        "pages/market/detail",
        "pages/order/index",
        "pages/order/result",
        "pages/order/order",
        "pages/order/detail",
      ],
    },
    {
      root: "settings",
      name: "settings",
      pages:[
        "pages/index/index",
        "pages/user/baseInfo",
        "pages/user/test",
        "pages/address/index",
        "pages/address/add",
        "pages/address/edit",
      ]
    },{
      root: "misc",
      name: "misc",
      pages:[
        "pages/calculator/index",
        "pages/fengmap/index",
        "pages/map/index",
        "pages/ooomap/index",
      ]
    }
  ],
  permission: {
    "scope.userLocation": {
      desc: "你的位置信息将用于确定附近商店",
    },
  },
  lazyCodeLoading: "requiredComponents",
  requiredPrivateInfos: ["getLocation", "chooseAddress"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    custom: true,
    color: "#000000",
    selectedColor: "#DC143C",
    backgroundColor: "#ffffff",
    list: [
      {
        // "iconPath": "assets/home-6-line.png",
        // "selectedIconPath": "assets/home-6-fill.png",
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        // "iconPath": "assets/apps-2-line.png",
        // "selectedIconPath": "assets/apps-2-fill.png",
        pagePath: "pages/category/index",
        text: "分类",
      },
      {
        // "iconPath": "assets/compass-3-line.png",
        // "selectedIconPath": "assets/compass-3-fill.png",
        pagePath: "pages/find/index",
        text: "发现",
      },
      {
        // "iconPath": "assets/shopping-cart-2-line.png",
        // "selectedIconPath": "assets/shopping-cart-2-fill.png",
        pagePath: "pages/cart/index",
        text: "购物车",
      },
      {
        // "iconPath": "assets/user-line.png",
        // "selectedIconPath": "assets/user-fill.png",
        pagePath: "pages/my/index",
        text: "我的",
      },
    ],
  },
});
