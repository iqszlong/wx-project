import { getPost } from "@/utils/request";
// 订单 -------------------

// 提交订单
// Authorization string 需要登录token认证
/*
  goodsList  array 购物车中商品id集合 {goodsId,skuId,quantity}
  addressId int 收货地址id
  remark  string 订单备注
  deliveryDate string  送达日期(格式：yyyy-MM-dd)
  deliveryTime string  送达时间段(例：13:00-19:00)
 */
export const postOrder = (data) => {
  return getPost.post("/app/orders", data);
};

// 查询订单列表
/**
 * Authorization
 *
 * pageNo int 页码，从 1 开始
 * pageSize int 每页条数，最大值为 100
 * showStatus int 订单状态：0-全部, 1-待支付，2-待发货，3-待收货，4-待评价，5-退款/售后
 */
export const getOrder = (params) => {
  return getPost.get("/app/orders", { params: params });
};

// 查询订单详情
/**
 * Authorization
 *
 * id string 订单id
 */
export const getOrderDetail = (params) => {
  return getPost.get(`/app/orders/${params.id}`);
};

// 订单预支付
/**
 * Authorization
 *
 * id string 订单id
 */
export const getOrderPrepay = (data) => {
  return getPost.post(`/app/orders/${data.id}/prepay`);
};

// 取消订单
/**
 * Authorization
 *
 * id string 订单id
 */
export const cancelOrder = (data) => {
  return getPost.post(`/app/orders/${data.id}/cancel`);
};

// 删除订单
/**
 * Authorization
 *
 * id string 订单id
 */
export const delOrder = (data) => {
  return getPost.post(`/app/orders/${data.id}/remove`);
};

// 申请退款
/**
 * Authorization
 *
 * id string 订单id
 */
 export const refundOrder = (data) => {
  return getPost.post(`/app/orders/${data.id}/refund`);
};

// 确认收货
/**
 * Authorization
 *
 * id string 订单id
 */
 export const confirmOrder = (data) => {
  return getPost.post(`/app/orders/${data.id}/confirm`);
};