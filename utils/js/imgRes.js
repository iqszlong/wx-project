//预览图片路径
const previewMediaPath = (path,size='500x304',bg='ddd',color='555',text='') => {
    let pathStr = "";
    if (typeof path === "undefined" || path === "") {
      pathStr = `//fakeimg.pl/${size}/${bg}/${color}/?text=${text}&font=noto`;
    } else {
      pathStr = `${path}`;
    }
    // console.log(pathStr);
    return pathStr;
  };
  
export {previewMediaPath}