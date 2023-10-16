import { getPost } from "@/utils/request";

// 点击记录
// name string 访问对象名称
export const clickRecord = (data) => {
    return getPost.post("/app/analysis/click", data);
};