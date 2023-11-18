<template>
    <view class="order-detail">
        <div class="order-cell">
            <div class="status">
                <span class="title">{{statusText}}</span>
                <!-- <div class="desc">
                    剩 <nut-countdown class="countdown" :end-time="end" format="DD 天 HH 时 mm 分 ss 秒"></nut-countdown>
                    支付，过时订单将会取消
                </div> -->
            </div>

            <div class="address">
                <div class="current-select">
                    <nut-icon name="locationg3"></nut-icon>
                    <div class="ad-body">
                        <div class="ad-title">
                            {{consignee}}
                            {{mobile}}
                        </div>
                        <div class="ad-detail">
                            {{address}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="order-cell">
            <div class="order-goods-item">
                <shopCartItem v-for="goods of goodsList" :img-url="goods.picUrl" :title="goods.goodsName"
                    :price="`${goods.price}`" :data="goods">
                    <template #footer>
                        <div>
                            x{{goods.quantity}}
                            <!-- <nut-price :price="goods.totalPrice" size="normal" :decimal-digits="2" /> -->
                        </div>
                    </template>
                </shopCartItem>
            </div>

            <div class="order-cell-item">
                <div class="label">
                    商品总额
                </div>
                <div class="n-space"></div>
                <nut-price :price="goodsPrice" size="normal" :decimal-digits="2" />
            </div>

            <div class="order-cell-item">
                <div class="label">
                    配送费用
                </div>
                <div class="n-space"></div>
                <nut-price :price="freightPrice" size="normal" :decimal-digits="2" />
            </div>

            <div class="order-cell-item">
                <div class="label">
                    应付
                </div>
                <div class="n-space"></div>
                <nut-price :price="actualPrice" size="large" :decimal-digits="2" />
            </div>

        </div>


        <div class="order-cell">
            <div class="order-cell-item">
                <div class="label">
                    订单编号
                </div>
                <div class="n-space"></div>
                {{orderSn}}
            </div>
            <div class="order-cell-item">
                <div class="label">
                    下单时间
                </div>
                <div class="n-space"></div>
                {{createTime}}
            </div>
            <nut-divider style="margin:0" />

            <div class="order-cell-item">
                <div class="label">
                    期望送达日期
                </div>
                <div class="n-space"></div>
                {{deliveryDate}}
            </div>

            <div class="order-cell-item">
                <div class="label">
                    期望送达时间
                </div>
                <div class="n-space"></div>
                {{deliveryTime}}
            </div>

            <div class="order-cell-item">
                <div class="label">
                    备注
                </div>
                <div class="n-space"></div>
                {{remark}}
            </div>

        </div>




    </view>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { Router } from "tarojs-router-next"; // 路由库
import api from '@/api/index';

export default {
    components: {
    },
    setup() {

        const routerParams = Router.getParams();

        const state = reactive({
            "id": 2,
            "orderSn": "20221021029149",
            "status": "101",
            "statusText": "未付款",
            "actualPrice": 46,
            "goodsList": [
                {
                    "goodsId": 12,
                    "goodsName": "MEO MED一次性防护口罩",
                    "skuId": 12,
                    "quantity": 10,
                    "price": 4.6,
                    "totalPrice": 46,
                    "picUrl": "https://img14.360buyimg.com/n2/s240x240_jfs/t1/177616/10/15487/77288/60fa3249E052b6518/81e858de20eb1a61.jpg!q70.jpg.webp",
                    "specification": "标准"
                }
            ],
            "handleOption": {
                "cancel": true,
                "delete": false,
                "pay": true,
                "comment": false,
                "confirm": false,
                "refund": false,
                "rebuy": false,
                "aftersale": false
            },
            "createTime": "2022-10-21 00:08:54",
            "consignee": "张",
            "address": "广东省深圳市南山区天悦阁3A232",
            "mobile": "18603573433",
            "goodsPrice": "46.00",
            "freightPrice": "0.00",
            "deliveryDate": "2022-10-21",
            "deliveryTime": "尽快送达",
            end: Date.now() + 60 * 10000,
        });


        const getData = () => {
            api.getOrderDetail({ id: routerParams.id }).then(res => {
                const { code, data } = res;
                if (code == 0) {
                    // console.log(data);
                    state.id = data.id;
                    state.orderSn = data.orderSn;
                    state.statusText = data.statusText;
                    state.actualPrice = data.actualPrice;
                    state.goodsList = data.goodsList;
                    state.handleOption = data.handleOption;
                    state.createTime = data.createTime;
                    state.consignee = data.consignee;
                    state.address = data.address;
                    state.mobile = data.mobile;
                    state.goodsPrice = data.goodsPrice;
                    state.freightPrice = data.freightPrice;
                    state.deliveryDate = data.deliveryDate;
                    state.deliveryTime = data.deliveryTime;
                }
            })
        }

        onMounted(() => {
            getData();
        })


        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss">
.order-detail {
    height: 100vh;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .order-cell {
        background: $white;
        display: flex;
        flex-direction: column;
        // gap: 8px;
    }

    .status {
        background: linear-gradient(135deg, $primary-color 0%, $primary-color-end 100%);
        color: $white;
        padding: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 16px;
        border-radius: 10px;
        gap: 8px;

        .title {
            font-size: 20px;
            font-weight: bold;
        }

        .desc {
            font-size: 12px;
        }

        .countdown {
            display: inline-block;
            font-size: 12px;
        }
    }



    .address {
        box-shadow: none;
        border: none;
    }

    .order-cell-item {
        padding: 8px 16px;
        display: flex;

        .label{
            color: #666;
        }
    }

    .order-goods-item{
        padding: 8px 16px;
    }
}
</style>
