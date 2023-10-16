// 预约状态数据
// 状态种类
const stateCag = [
  {
    name: "待预约",
    value: "0",
    color: "#007AFF",
  },
  {
    name: "待确认",
    value: "1",
    color: "#FF9A3D",
  },
  {
    name: "已确认",
    value: "2",
    color: "#5AD874",
  },
];

// 返回找到的项目
const findStateCag = (value = '0') => {
  return stateCag.find((el) => el.value == value);
};

// 返回找到的颜色
const findStateColor = (value = '0') => {
  const item = findStateCag(value);
  return item.color;
};

export { stateCag, findStateCag, findStateColor };
