<template>
    <div class="n-title-bar" :style="{ height: `${titleBarHeight}px` }">
        <div class="n-space">
            <nut-button v-if="isShowBack" class="btn-ctrl" type="default" size="small" icon-font-class-name="remixicon"
                icon-class-prefix="ri" icon="arrow-left-line" @click="goBack" style="border:none;">
            </nut-button>
            <nut-button v-if="isShowHome" class="btn-ctrl" type="default" size="small" icon-font-class-name="remixicon" icon-class-prefix="ri"
                icon="home-4-line" @click="switchTab('/pages/index/index')" style="border:none;">
            </nut-button>
            <slot name="left"></slot>
        </div>
        <div class="title"><slot>{{ title }}</slot></div>
        <div class="n-space last">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
import utils from '@/utils/index';
import Taro from '@tarojs/taro';
import { reactive, toRefs, onMounted } from 'vue'



export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        titleBarHeight:{
            type: Number,
            default: 0
        }
    },
    setup(props) {

        const state = reactive({
            ...props,
            isShowHome: false,
            isShowBack: false,
        })

        onMounted(() => {
            const pages = Taro.getCurrentPages();
            if (pages.length > 1) state.isShowBack = true;
            if (pages.length > 2) state.isShowHome = true;
        })



        return {
            ...toRefs(state),
            goBack: () => utils.router.goBack(),
            switchTab: (url) => utils.router.switchTab(url),
        }
    }
}
</script>

<style lang="scss">
// 标题
.n-title-bar {
    display: flex;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;

    .btn-ctrl {
        font-size: 18px;
        color: $title-color;
        padding: 0;
        width: 28px;
        height: 28px;

        +.btn-ctrl {
            margin-left: 8px;
        }
    }
}
</style>