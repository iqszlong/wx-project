import { axios, PostData, FileData, getPost } from "@/utils/request";
// 商品 -----------------

// 查询商品分类
export const getGoodsCag = () => {
  return getPost.get("/app/goods/categories");
};

// 查询商品列表
/*
  pageNo int 必填 页码，从 1 开始
  pageSize int 必填 每页条数，最大值为 100
  sort string 排序字段
  order string 升序：asc，降序：desc
  name string 商品名称
  categoryId int 商品分类id
*/
export const getGoodsList = (params) => {
  return getPost.get("/app/goods", { params: params });
};

// 查询商品详情
/*
  id string 商品id
*/
export const getGoodsDetail = (params) => {
  return getPost.get(`/app/goods/${params.id}`);
};

// 查询商品规格
/*
  id string 商品id
*/
export const getGoodSpecs = (params) => {
  return getPost.get(`/app/goods/${params.id}/specifications`);
};

// 查询商品sku信息
/*
  id string 商品id
  specValueIds array 商品规格id集合
*/
export const getGoodSku = (params) => {
  return getPost.get(`/app/goods/${params.id}/sku`, {
    params: params,
    paramsSerializer: function(params) {
      return qs.stringify(params, { indices: false });
    },
  });
};

// 购物车 -----------------
// 查询购物车商品
// Authorization 需要登录token认证
/*
  pageNo int 必填 页码，从 1 开始
  pageSize int 必填 每页条数，最大值为 100
*/
export const getShopCart = (params) => {
  return getPost.get("app/shopping-cart", { params: params });
};

// 添加商品到购物车
// Authorization 需要登录token认证
/**
 * goodsId int 商品ID
 * skuId int
 * quantity int 数量
 */

export const addShopCart = (data) => {
  return getPost.post("/app/shopping-cart", data);
};

// 删除购物车商品
// Authorization string 需要登录token认证
/* {skuIds:[id]}
 */
export const delShopCart = (data) => {
  return getPost.post(`/app/shopping-cart/remove`, data);
};

// 清空购物车
// Authorization string 需要登录token认证
export const clearShopCart = () => {
  return getPost.post("/app/shopping-cart/empty");
};