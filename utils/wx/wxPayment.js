import Taro from "@tarojs/taro";
// 微信支付
const pay = (data) => {
  // console.log('data',data);
  return Taro.requestPayment({
    timeStamp: data.timeStamp,
    nonceStr: data.nonceStr,
    package: data.packageValue,
    signType: data.signType,
    paySign: data.paySign,
    // success: function(res) {
    //   utils.router.redirect("/pages/order/result");
    // },
    // fail: function(res) {
    //   console.log(res);
    // },
  });
};

export { pay };
