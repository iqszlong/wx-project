import * as home from "./home"
import * as user from "./user"
import * as shopCart from "./shopCart"
import * as address from "./address"
import * as order from "./order" // 订单
import * as analysis from "./analysis" // 分析
export default {
    ...home,
    ...user,
    ...analysis,
    ...shopCart,
    ...address,
    ...order,
}