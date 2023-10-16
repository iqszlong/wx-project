<template>
    <div :class="['n-top-ctrl', css != '' ? css : null]" :style="{ height: `${topHeight}px` }">
        <StatusBar :statusBarHeight="statusBarHeight"></StatusBar>
        <TitleBar :title="title" :titleBarHeight="titleBarHeight">
            <template #left>
                <slot name="left"></slot>
            </template>
            <slot></slot>
            <template #right>
                <slot name="right"></slot>
            </template>
        </TitleBar>
    </div>
    <div v-if="setPlace" :style="{ height: `${topHeight}px` }"></div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import {
    getSystemInfo,
    getMenuButtonBoundingClientRect
} from "@tarojs/taro";

import StatusBar from './statusBar';
import TitleBar from './titleBar';
export default {
    components: {
        StatusBar,
        TitleBar,
    },
    props: {
        title: {
            type: String,
            default: '标题'
        },
        setPlace: {
            type: Boolean,
            default: false,
        },
        class: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const state = reactive({
            ...props,
            css: props.class,
            statusBarHeight:0,
            titleBarHeight:36,
            topHeight: computed(() => state.statusBarHeight + state.titleBarHeight),
        })

        onMounted(() => {
            getSystemInfo().then((res) => {
                state.statusBarHeight = res.statusBarHeight;
                state.titleBarHeight =
                    getMenuButtonBoundingClientRect().bottom +
                    getMenuButtonBoundingClientRect().top -
                    res.statusBarHeight * 2;
                
            });
        })


        return {
            ...toRefs(state),
        }
    }
}
</script>

<style lang="scss" scoped>

</style>