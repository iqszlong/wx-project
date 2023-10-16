// 转换
/**
 * base64图片转换为FIle
 * @param {string} dataurl base64字符串
 * @param {string} filename 文件名
 * @param {string} mime 文件类型
 * @returns File
 */
export const dataURLtoFile = (dataurl, filename, mime = "image/jpeg") => {
  // 获取到base64编码
  const arr = dataurl.split(",");
  // 将base64编码转为字符串
  const bstr = winodw.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {
    type: mime,
  });
};

/**
 * 转换英文日期为中文日期
 * @param {string} date 英文日期，格式为Month Day, Year 或 Month Year
 * @returns {string} 中文日期，格式为YYYY年M月D日 或 YYYY年M月
 */
export const transformDate = (date) => {
  const monthMap = {
    "Jan": "1",
    "Feb": "2",
    "Mar": "3",
    "Apr": "4",
    "May": "5",
    "Jun": "6",
    "Jul": "7",
    "Aug": "8",
    "Sep": "9",
    "Oct": "10",
    "Nov": "11",
    "Dec": "12",
  }
  const dateArray = date.split(" ");
  if(dateArray.length > 2){
    const [month, day, year] = dateArray;
    const chineseDate = `${year}年${monthMap[month]}月${parseInt(day)}日`;
    return chineseDate;
  }
  const [month,  year] = dateArray;
  const chineseDate = `${year}年${monthMap[month]}月`;
  return chineseDate;
};




/**
 * 将小写英文所有首字母转换为大写
 * @param {string} str 待转换字符串
 * @returns {string} 转换后字符串
 */
export const capitalizeFirstLetter = (str) => {
  return str.replace(/\b[a-z]/g, (char) => char.toUpperCase());
};
