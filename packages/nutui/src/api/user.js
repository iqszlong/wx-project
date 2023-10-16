import { getPost } from "@/utils/request";

// code string 通过wx.login获取的code
export const wxLogin = (data) => {
  return getPost.post("/app/auth/login", data);
};

// 获取微信手机号
/**
 * Authorization
 *
 * code string 手机号获取凭证 微信获取用户授权后获得的code
 */
export const wxPhone = (params) => {
  return getPost.get("/app/user/wxPhone", { params: params });
};

// 查询用户信息
/**
 * Authorization
 */
export const getUserInfo = () => {
  return getPost.get("/app/user/me");
};

// 更新用户信息
/**
 * Authorization
 *
 * nickName string 昵称
 * phone string 手机号
 * gender int 性别(0-未知，1-男，2-女)
 * avatarUrl string 头像url
 */
export const editUserInfo = (data) => {
  return getPost.put("/app/user/profile", data);
};
