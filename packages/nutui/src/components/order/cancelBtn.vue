<template>
    <div>
        <nut-button :size="size" @click="confirm = true">
            <slot>{{ text }}</slot>
        </nut-button>

        <nut-dialog :title="text" lock-scroll v-model:visible="confirm" @cancel="confirm = false" @ok="ok"
            :overlay-style="{ zIndex: 12 }" :pop-style="{ zIndex: 15 }" />

        <!-- 消息 -->
        <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" :duration="duration" />
    </div>
</template>

<script>
import api from '@/api/index'
import { reactive, toRefs } from 'vue'

export default {
    props: {
        orderId: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: '取消订单',
        },
        size: {
            type: String,
            default: 'small',
        },
    },
    emits: ['canceled', 'cancelfail'],
    setup(props, { emit }) {
        const state = reactive({
            ...props,
            confirm: false, // 确认
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
            api.cancelOrder({ id: state.orderId }).then(res => {
                const { code, msg } = res;
                if (code == 0) {
                    tips.msg = `${state.text}成功`;
                    tips.type = 'success';
                    tips.show = true;
                    tips.cover = true;
                    setTimeout(() => {
                        emit('canceled');
                    }, tips.duration)

                } else {
                    tips.msg = msg;
                    tips.type = 'fail';
                    tips.show = true;
                    tips.cover = true;
                    setTimeout(() => {
                        emit('cancelfail');
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