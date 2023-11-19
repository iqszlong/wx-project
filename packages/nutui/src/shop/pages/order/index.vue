<template>
    <PageLoading v-if="loading"></PageLoading>
    <view v-else class="order">
        <addressSelect ref="address"></addressSelect>

        <div class="product-list">
            <div class="product-item" v-for="item of pList" :key="item.id">
                <shopCartItem :img-url="item.goodsPicUrl" :title="item.goodsName" :price="`${item.goodsPrice}`" :data="item"
                    :min="1">

                </shopCartItem>
            </div>
        </div>

        <div>
            <nut-input v-model="deliveryDate" label="送达日期" readonly @click="popDate = true" />
            <nut-input v-model="deliveryTime" label="送达时间段" readonly @click="popTime = true" />
            <nut-input v-model="remark" label="备注" type="textarea" show-word-limit rows="2" max-length="50" />
        </div>



        <!-- 日期弹窗 -->
        <nut-popup position="bottom" v-model:visible="popDate">
            <nut-date-picker v-model="currentDate" :min-date="minDate" :three-dimensional="false" @confirm="confirmDate">
            </nut-date-picker>
        </nut-popup>


        <!-- 时间弹窗 -->
        <nut-popup position="bottom" v-model:visible="popTime">
            <nut-picker :columns="timeColumns" title="送达时间段" @confirm="confirmTime" :threeDimensional="false">
            </nut-picker>
        </nut-popup>




        <!-- 消息 -->
        <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />


        <bottomCtrl ref="bottom" :list="pList" :style="{ zIndex: 10 }">
            <template #btn>
                <payBtn ref="paybtn" @getParams="goCheckOrder" @payed="goResult">下单</payBtn>
            </template>
        </bottomCtrl>


    </view>
</template>

<script>

import { reactive, toRefs, onMounted, ref } from 'vue';

import { Router } from "tarojs-router-next"; // 路由库
import utils from '@/utils/index';

export default {
    onShow() {

    },
    setup() {
        const routerData = Router.getData();

        // 地址dom
        const address = ref(null);
        const paybtn = ref(null);
        // 弹窗
        const pop = reactive({
            popPayType: false,
            popDate: false,
            popTime: false,
        });
        // 消息提示
        const tips = reactive({
            msg: "下单信息",
            show: false,
            type: "text",
            cover: false,
        });
        const state = reactive({
            remark: "",
            deliveryDate: utils.day.dayjs().format("YYYY-MM-DD"),
            deliveryTime: "尽快送达",
            pList: [],
            params: null, // 下单参数
        });
        const pageData = reactive({
            loading: true,
            currentDate: utils.day.dayjs().toDate(),
            minDate: utils.day.minDay(),
            timeColumns: [
                { text: "尽快送达", value: "尽快送达" },
                { text: "9:00 ~ 9:30", value: "9:00-9:30" },
                { text: "9:30 ~ 10:00", value: "9:30-10:00" },
                { text: "10:00 ~ 10:30", value: "10:00-10:30" },
                { text: "10:30 ~ 11:00", value: "10:30-11:00" },
                { text: "11:00 ~ 11:30", value: "11:00-11:30" },
                { text: "11:30 ~ 12:00", value: "11:30-11:00" },

                { text: "12:00 ~ 12:30", value: "12:00-12:30" },
                { text: "12:30 ~ 13:00", value: "12:30-13:00" },
                { text: "13:00 ~ 13:30", value: "13:00-13:30" },
                { text: "13:30 ~ 14:00", value: "13:30-14:00" },
                { text: "14:00 ~ 14:30", value: "14:00-14:30" },
                { text: "14:30 ~ 15:00", value: "14:30-15:00" },
                { text: "15:00 ~ 15:30", value: "15:00-15:30" },
                { text: "15:30 ~ 16:00", value: "15:30-16:00" },
                { text: "16:00 ~ 16:30", value: "16:00-16:30" },
                { text: "16:30 ~ 17:00", value: "16:30-17:00" },
                { text: "17:00 ~ 17:30", value: "17:00-17:30" },
                { text: "17:30 ~ 18:00", value: "17:30-18:00" },
                { text: "18:00 ~ 18:30", value: "18:00-18:30" },
                { text: "19:30 ~ 20:00", value: "19:30-20:00" },
                { text: "20:00 ~ 20:30", value: "20:00-20:30" },
                { text: "20:30 ~ 21:00", value: "20:30-21:00" },
            ],
            orderId: null // 下单生成的订单id
        });
        // 选择日期
        const confirmDate = ({ selectedValue, selectedOptions }) => {
            state.deliveryDate = selectedValue.join("-");
        };
        // 选择时间
        const confirmTime = ({ selectedValue, selectedOptions }) => {
            state.deliveryTime = selectedValue;
        };

        // 验证地址
        const verifyAddress = () => {
            return address.value.checkAddress();
        };

        // 下单
        const goCheckOrder = () => {
            // console.log("下单");
            if (!verifyAddress()) {
                tips.msg = "请选择配送地址";
                tips.type = "warn";
                tips.show = true;
                return;
            }
            // console.log(address);
            // console.log(goodslist);
            // 当前选择的地址
            const selectAddress = address.value.returnData();
            const goodsList = state.pList.map(el => {
                return {
                    goodsId: el.goodsId,
                    skuId: el.skuId,
                    quantity: el.quantity,
                };
            });
            // console.log(selectAddress.id, goodsList);
            // return;
            state.params = {
                goodsList: goodsList,
                addressId: selectAddress.id,
                remark: state.remark,
                deliveryDate: state.deliveryDate,
                deliveryTime: state.deliveryTime,
            };

            // console.log(state.params);
            // console.log(paybtn);
            paybtn.value.postOrder(state.params);

        };



        const getData = () => {
            // console.log('routerData',routerData);
            state.pList = routerData;
            pageData.loading = false;
        };

        onMounted(() => {
            getData();
        });

        return {
            address,
            paybtn,
            ...toRefs(state),
            ...toRefs(pop),
            ...toRefs(tips),
            ...toRefs(pageData),
            goCheckOrder,
            confirmDate,
            confirmTime,
            getData,
            goResult: () => utils.router.redirect("/shop/pages/order/result"),
        };
    },
}
</script>

<style lang="scss">
.order {
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}
</style>
