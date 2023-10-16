import { defineStore } from "pinia";
import utils from "@/utils/index";
import api from "@/api/index";
import bus from "vue3-eventbus";
import Taro from "@tarojs/taro";

// 系统
export const useSystemStore = defineStore("system", {
  state: () => {
    return {
      selected: 0, // 底部导航选中默认值
      user:
        Taro.getStorageSync("user") != ""
          ? JSON.parse(Taro.getStorageSync("user"))
          : null, // 用户信息
    };
  },
  actions: {
    async getUserInfo() {
      // 获取用户数据
      const res = await api.getUserInfo();
      const { code, data, msg } = res;
      if (code == 0) {
        let userInfo = data;
        if (
          !Object.hasOwn(userInfo, "nickName") ||
          !Object.hasOwn(userInfo, "avatarUrl")
        ) {
          userInfo = utils.wxLogin.defaultUser;
        }
        // console.log("====================================");
        // console.log(userInfo);
        // console.log("====================================");
        this.setUserInfo(userInfo);
        this.isUpdate = false;
      } else {
        // console.log(msg);
        utils.wxUx.showToast({title:`${msg}`,icon:'error'});
      }
    },
    setUserInfo(data) {
      Taro.setStorageSync("user", JSON.stringify(data));
      this.user = data;
    },
    clear() {
      Taro.removeStorageSync("user");
      Taro.removeStorageSync("token");
    },
  },
});

// 店铺
export const useShopStore = defineStore("shop", {
  state: () => {
    return {
      marketCag: null, // 超市分类id
      takeoutCag: null, // 外卖分类id
    };
  },
});

// 购物车
export const useCartStore = defineStore("shopcart", {
  state: () => {
    return {
      pageNo: 1,
      pageSize: 100,
      shopCartList: [], // 购物车列表
      total: 0,
      price: 0, // 购物车小计
    };
  },
  getters: {
    // 合计总价
    sumPrice: (state) => {
      state.price = utils.order.countPrice(state.shopCartList);
    },
  },
  // 同步异步都可以
  actions: {
    async getList() {
      const res = await api.getShopCart({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });

      const { code, data, msg } = res;
      if (code == 0) {
        // console.log(data);
        this.shopCartList = data.list;
        this.total = data.total;
      } else {
        console.log("getShopCart Error", msg);
      }
    },
    async empty() {
      const res = await api.clearShopCart();
      const { code } = res;
      if (code == 0) {
        this.$reset();
      }
    },
    async delItem(skuIds) {
      const res = await api.delShopCart({ skuIds });
      const { code } = res;
      if (code == 0) {
        await this.getList();
        this.sumPrice;
        //   bus.emit("syncData");
      }
    },
    async addItem(item) {
      let cartItem = {};

      if (item.hasOwnProperty("goodsId")) {
        cartItem = item;
      } else {
        cartItem = {
          goodsId: item.id,
          goodsName: item.name,
          goodsOrigainalPrice: item.originalPrice,
          goodsPicUrl: item.mainPicUrl,
          goodsPrice: item.price,
          quantity: item.quantity,
          skuId: item.skuId,
          specification: item.specification,
          selected: item.selected,
        };
      }
      if (cartItem.quantity == 0) {
        // 删除请求
        const skuIds = [cartItem.skuId];
        await this.delItem(skuIds);
      }
      if (cartItem.quantity >= 1) {
        // 添加请求
        const res = await api.addShopCart([
          {
            goodsId: cartItem.goodsId,
            skuId: cartItem.skuId,
            quantity: cartItem.quantity,
          },
        ]);

        const { code } = res;
        if (code == 0) {
          await this.getList();
          this.sumPrice;
          //   bus.emit("syncData");
        }
      }
    },
  },
});
