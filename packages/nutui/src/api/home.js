import { axios, PostData, FileData, getPost } from "@/utils/request";

// 京东测试分类接口
export const test = () => {
  return axios.get("https://storage.360buyimg.com/nutui/3x/categoryData.js");
};

export const testRequest = () => {
  return new Promise((resolve, reject) => {
    let condition = false;
    setTimeout(() => {
      // 随机数 0~1
      condition = Math.floor(Math.random() * 2);

      if (condition) {
        // 正常返回结果
        resolve({ code: 0 });
      } else {
        // 返回错误
        reject({ code: 433, msg: "error" });
      }
    }, 1000);
  });
};

// 上传例子
export const upload = async () => {
  const { tempFilePaths } = await Taro.chooseImage({ count: 1 });
  Taro.showLoading({ title: "图片上传中..." });
  const res = await axios.post(
    "https://sm.ms/api/upload",
    new PostData({
      smfile: new FileData(tempFilePaths[0]),
      ssl: true,
      format: "json",
    })
  );
  Taro.hideLoading();
  Taro.showModal({
    title: "返回结果",
    content: JSON.stringify(res.data),
  });
};
