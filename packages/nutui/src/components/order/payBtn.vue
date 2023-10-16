
<template>
    <div>
        <nut-button type="primary" :size="size" @click="goCheckOrder">
            <slot>{{text}}</slot>
        </nut-button>
        <!-- 消息 -->
        <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" :duration="duration" />
        <!-- 付款弹窗 -->
        <nut-actionsheet v-model:visible="popPayType" title="选择支付方式">
            <nut-button shape="square" block size="large" style="border:none" @click="pay('wx')">微信支付</nut-button>
            <nut-button shape="square" block @click="popPayType = false">取消</nut-button>
        </nut-actionsheet>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import utils from '@/utils/';
import api from '@/api/';

export default {
    props: {
        text: {
            type: String,
            default: '付款',
        },
        size: {
            type: String,
            default: 'small',
        },
        orderId: {
            type: String,
            default: '',
        },
    },
    emits: ['getParams', 'payed','payfail'],
    setup(props, { emit }) {
        const state = reactive({
            ...props,
            popPayType: false,
        })

        // 消息提示
        const tips = reactive({
            msg: '',
            show: false,
            type: 'text',
            cover: false,
            duration: 2000,
        });

        // 下单
        const goCheckOrder = () => {
            if (state.orderId == '') {
                emit('getParams');
                return;
            }
            state.popPayType = true;

        }

        // 下单请求
        const postOrder = (params) => {
            if (params == null) { console.log('无参数'); return; }
            api.postOrder(params).then(res => {
                const { code, data } = res;
                if (code == 0) {
                    state.orderId = data.id; // 获取订单id
                    goCheckOrder();// 重新支付
                }
            });
        }

        // pay
        const pay = (type) => {
            tips.msg = '正在支付';
            tips.cover = true;
            tips.type = 'loading';
            tips.show = true;
            tips.duration = 0;
            state.popPayType = false;

            if (type == 'wx') {
                // 使用微信订单预支付
                api.getOrderPrepay({ id: state.orderId }).then(res => {
                    const { code, data, msg } = res;
                    if (code == 0) {
                        utils.wxPayment.pay(data).then(res => {
                            console.log(res);
                            tips.duration = 2000;
                            tips.show = false;
                            emit('payed'); // 支付成功后触发方法
                        }).catch(err=>{
                            console.log(err);
                            tips.duration = 2000;
                            tips.show = false;
                            emit('payfail'); // 支付失败触发
                        })
                        
                    } else {
                        tips.msg = msg;
                        tips.cover = true;
                        tips.type = 'fail';
                        tips.show = true;
                        tips.duration = 2000;
                    }
                })
            }
        }

        return {
            ...toRefs(state),
            ...toRefs(tips),
            goCheckOrder,
            pay,
            postOrder,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>