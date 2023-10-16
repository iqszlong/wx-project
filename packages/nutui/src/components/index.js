import LoginView from "@/components/loginView/index.vue";
import userAvatar from "@/components/avatar/index.vue";
import PageLoading from "@/components/pageLoading/index.vue";
import locationBtn from "@/components/locationBtn/index.vue";
import ShopCartList from "@/components/shopCartList/index.vue";
import bottomCtrl from "@/components/shopCartList/bottomCtrl.vue";
import minShopCart from "@/components/shopCartList/minBtn.vue";
import shopCartItem from "@/components/shopCartList/item.vue";
import addCtrl from "@/components/shopCartList/addCtrl.vue";
import goodItem from "@/components/goodItem/index.vue";
import specBtn from "@/components/goodItem/specBtn.vue"; //选规格按钮
import addressSelect from "@/components/addressSelect/index.vue";
import payBtn from "@/components/order/payBtn.vue";
import cancelBtn from "@/components/order/cancelBtn.vue";
import delBtn from "@/components/order/delBtn.vue";
import refundBtn from "@/components/order/refundBtn.vue";
import confirmBtn from "@/components/order/confirmBtn.vue";
import rebuyBtn from "@/components/order/rebuyBtn.vue";

export default {
  install(app) {
    // 此处形参为main.js文件中use()方法自动传进来的Vue实例
    app
      .component("LoginView", LoginView)
      .component("userAvatar", userAvatar)
      .component("PageLoading", PageLoading)
      .component("ShopCartList", ShopCartList)
      .component("locationBtn", locationBtn)
      .component("bottomCtrl", bottomCtrl)
      .component("minShopCart", minShopCart)
      .component("addCtrl", addCtrl)
      .component("goodItem", goodItem)
      .component("specBtn", specBtn)
      .component("shopCartItem", shopCartItem)
      .component("addressSelect", addressSelect)
      .component("payBtn", payBtn)
      .component("cancelBtn", cancelBtn)
      .component("delBtn", delBtn)
      .component("refundBtn", refundBtn)
      .component("confirmBtn", confirmBtn)
      .component("rebuyBtn", rebuyBtn);
  },
};
