// 文件类型筛选
const fileTypes = {
  image: ["png", "jpg", "jpeg", "bmp", "gif", "webp", "psd", "svg", "tiff"],
  video: [
    "avi",
    "flv",
    "mpg",
    "mpeg",
    "mpe",
    "m1v",
    "m2v",
    "mpv2",
    "mp2v",
    "dat",
    "tp",
    "tpr",
    "pva",
    "pss",
    "mp4",
    "m4v",
    "m4p",
    "m4b",
    "3gp",
    "3gpp",
    "3g2",
    "3gp2",
    "ogg",
    "mov",
    "qt",
    "amr",
    "rm",
    "ram",
    "rmvb",
    "rpm",
    "webm"
  ],
  html: [".html", ".htm"],
  style: [".css", ".scss", ".sass", ".less"],
  js: [".js", ".jsx"],
  json: [".json"],
};

//文件类型后缀
const fileType = (file) => {
  let filePath = file;
  if (typeof file === "object") {
    filePath = file.name;
  }
  const index = filePath.lastIndexOf(".");
  const ext = filePath.substr(index + 1);
  // console.log(ext);
  return ext;
};

//图片类型判断
const isAssetTypeAnImage = (ext) => {
  return fileTypes.image.indexOf(ext.toLowerCase()) !== -1;
};
//视频类型判断
const isAssetTypeAnVideo = (ext) => {
  return fileTypes.video.indexOf(ext.toLowerCase()) !== -1;
};

export { fileType, isAssetTypeAnImage, isAssetTypeAnVideo };
