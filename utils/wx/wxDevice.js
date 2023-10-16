// 微信设备相关

import Taro from "@tarojs/taro";


// 接口需要支持promise

// 剪贴板
export const setClipboard = (str) => {
  return Taro.setClipboardData({ data: str });
};

export const getClipboard = () => {
  return Taro.getClipboardData();
};

// 拍摄或从手机相册中选择图片或视频
export const chooseMedia = (opt) => {
  return Taro.chooseMedia(opt);
};

// 转换选择图片路径为其他类型
// 查看文档 https://taro-docs.jd.com/docs/apis/files/FileSystemManager
export const transformImgData = (imgPath,type="base64")=>{
    const fileName = imgPath.split('/').reverse()[0];
    const fileExt = fileName.split('.').reverse()[0].toLocaleLowerCase();
    let fileStr = null;
    fileStr = Taro.getFileSystemManager().readFileSync(imgPath, type);
    if(type == "base64"){
        fileStr = `data:image/${fileExt};base64,${fileStr}`;
    }
    return fileStr;
}

// 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
export const previewImage = (urls) =>{
  return Taro.previewImage({urls});
}

// 订阅消息
export const subMsg = (option) =>{
  return Taro.requestSubscribeMessage(option);
}


// 数据分析
export const reportEvent = (event,option) =>{
  return Taro.reportEvent(event,option);
}

// 向系统日历添加事件
export const exportCalendar = (option) =>{
  return Taro.addPhoneCalendar(option);
}

// export const shareApp = () => {
//   // 微信分享
//   return Taro.useShareAppMessage((res) => {
//     let data = null;
//     let user = store.getters.getUserInfo;
//     let title = `${user.nickName}向你推荐了时间平方小程序`;
//     let path = `/pages/contact/detail?id=${user.id}`;
//     let imgUrl = shareImg;
//     if (res.from === "button") {
//       // 来自页面内转发按钮
//       // console.log(res.target.dataset)
//       data = res.target.dataset;
//     }
//     console.log(data);
//     if (data) {
//       title = `${user.nickName}向你推荐了${data.name}服务`;
//       path = `/pages/contact/detail?id=${user.id}&sid=${data.sid}`;
//     }
//     return {
//       title: title,
//       path: path,
//       imageUrl: imgUrl,
//       /* 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及JPG。显示图片长宽比是 5:4。*/
//       // promise
//     };
//   });
// };
