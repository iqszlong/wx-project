import Taro from "@tarojs/taro";

export const showToast = ({ title = "成功", icon, duration = 2000 } = {}) => {
  return Taro.showToast({
    title,
    icon,
    duration,
  });
};

export const showModal = ({ title = "提示", content = "",success,complete } = {}) => {
  return Taro.showModal({
    title,
    content,
    success,
    complete,
  });
};

export const showLoading = ({ title = "加载中", mask = true } = {}) => {
  return Taro.showLoading({
    title,
    mask,
  });
};

export const hideLoading = () => {
  return Taro.hideLoading();
};
