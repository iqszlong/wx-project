<template>
    <div>
        <nut-button :size="size" @click="ok">
            <slot>{{ text }}</slot>
        </nut-button>



        <!-- 消息 -->
        <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" :duration="duration" />
    </div>
</template>

<script>
import api from '@/api/'
import { reactive, toRefs } from 'vue'
import utils from '@/utils/'

export default {
    props: {
        orderId: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: '再来一单',
        },
        size: {
            type: String,
            default: 'small',
        },
    },
    emits: ['rebuyed', 'rebuyfail'],
    setup(props, { emit }) {
        const state = reactive({
            ...props,
        })

        // 消息提示
        const tips = reactive({
            msg: '',
            show: false,
            type: 'text',
            cover: false,
            duration: 2000,
        });




        const ok = () => {
            if (state.orderId == '') return;
            api.getOrderDetail({ id: state.orderId }).then(res => {
                const { code, data, msg } = res;
                if (code == 0) {
                    let list = data.goodsList;
                    list = list.map(el => { return { ...el, goodsPrice: el.price, goodsPicUrl: el.picUrl } })
                    utils.router.goPage('/pages/order/index', { data: list })
                    emit('rebuyed');
                } else {
                    tips.msg = msg;
                    tips.type = 'fail';
                    tips.show = true;
                    tips.cover = true;
                    setTimeout(() => {
                        emit('rebuyfail');
                    }, tips.duration)
                }
            })
        }

        return {
            ...toRefs(state),
            ...toRefs(tips),
            ok,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>