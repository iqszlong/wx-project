<template>
    <div class="n-status-bar" :style="{ height: `${statusBarHeight}px` }"></div>
</template>

<script>
import { reactive, toRefs, } from 'vue';


export default {
    props: {
        statusBarHeight: {
            type: Number,
            default: 0
        },
    },
    setup(props) {

        const state = reactive({
           ...props,
        })

        return {
            ...toRefs(state),

        }
    }
}
</script>

<style lang="scss" >

</style>