<template>
    <view class="notfind">
        <TopBar title="未找到页面"></TopBar>
        <view>{{code}}</view>
        {{ msg }}
            


    </view>
</template>

<script>

import { reactive, toRefs } from 'vue';
export default {
    components: {
    },
    setup() {
        const state = reactive({
            code: '404',
            msg: '没找到内容',
        });



        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss">
.notfind {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
