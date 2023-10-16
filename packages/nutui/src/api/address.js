import { getPost } from "@/utils/request";
// 省市区 国标地区数据
/**
 * all string 传true查询所有地区数据
 * pid int 上级id，不传查询第一级地区
 */
export const getArea = (params) => {
    return getPost.get("/common/districts", { params: params });
};

// 收货地址 -------------------

// 查询收货地址
// Authorization string 需要登录token认证
/*
  pageNo int 必填 页码，从 1 开始
  pageSize int 必填 每页条数，最大值为 100
  default string 传 true 查询默认地址
 */
export const getAddress = (params) => {
  return getPost.get("/app/addresses", { params: params });
};

// 添加收货地址
// Authorization string 需要登录token认证
/*
    provinceName string 必填 第一级地址
    cityName string 必填 第二级地址
    countyName string 必填 第三级地址
    streetName string 必填 第四级地址
    detail string 必填 详细地址 邮编
    postalCode string 必填 详细地址
    name string 必填 收货人名称
    mobile string 必填 手机号
    default boolean 是否设为默认地址
   */
export const addAddress = (data) => {
  return getPost.post("/app/addresses", data);
};

// 根据 id 查询收货地址
// Authorization string 需要登录token认证
/*
    id string 地址id
   */
export const getAddressDetail = (params) => {
  return getPost.get(`/app/addresses/${params.id}`);
};

// 修改收货地址
// Authorization string 需要登录token认证
/*
    id string 地址id
    provinceName string 必填 第一级地址
    cityName string 必填 第二级地址
    countyName string 必填 第三级地址
    streetName string 必填 第四级地址
    detail string 必填 详细地址 邮编
    postalCode string 必填 详细地址
    name string 必填 收货人名称
    mobile string 必填 手机号
    default boolean 是否设为默认地址
   */
export const editAddress = (data) => {
  return getPost.put(`/app/addresses/${data.id}`, data);
};

// 删除收货地址
// Authorization string 需要登录token认证
/*
    id string 地址id
   */
export const delAddress = (params) => {
  return getPost.delete(`/app/addresses/${params.id}`);
};
