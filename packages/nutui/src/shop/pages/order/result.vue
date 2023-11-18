<template>
    <div class="reslut">
        <div class="box">
            <IconFont name="success" size="24px" color="#26bf26"></IconFont>
            <div>{{msg}}</div>
        </div>
    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { Router } from "tarojs-router-next"; // 路由库
import { IconFont } from '@nutui/icons-vue-taro';
export default {
    components: {
        IconFont,
    },
    setup() {
        const state = reactive({
            msg: '支付成功',
        })

        Router.setBackResult({reload:true});

        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss">
.reslut {
    padding: 16px;
    .box{
        min-height: 20vh;
    }
}

.box {
    background: $white;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
}
</style>