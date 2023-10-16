<template>
    <div :class="['n-bottom-ctrl',hasNav?'bottom':'']">
        <template v-if="!edit">

            <div class="price-tips">
                <nut-checkbox v-if="hasCheck" v-model="allSelect" @change="checkAll">全选</nut-checkbox>
                <div>
                    合计:
                    <nut-price class="price-num" :price="allPrice" size="normal" :decimal-digits="2" />
                </div>
            </div>
            <div class="n-space"></div>

            <slot name="btn"></slot>

        </template>
        <template v-else>

            <div class="price-tips">
                <nut-checkbox v-if="hasCheck" v-model="allSelect" @change="checkAll">全选</nut-checkbox>
            </div>
            <div class="n-space"></div>
            <nut-button type="danger" @click="confirmClear = true">清空</nut-button>
            <nut-button :disabled="disabled" @click="del">删除</nut-button>

        </template>
    </div>
    <!-- 清空购物车 -->
    <nut-dialog title="清空购物车" v-model:visible="confirmClear" @cancel="confirmClear = false" @ok="empty"
        :overlay-style="{zIndex:12}" :pop-style="{zIndex:15}" />
</template>

<script>
import { reactive, toRefs, computed, watch,onMounted } from 'vue'
import utils from '@/utils/index';
import {useCartStore} from "@/store/index";


export default {
    emits: ['checkAll'],
    props: {
        hasCheck: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            default: [],
        },
        edit: {
            type: Boolean,
            default: false
        },
        hasNav: {
            type: Boolean,
            default: false
        },
    },
    setup(props, { emit }) {

        const store = useCartStore();

        const state = reactive({
            ...props,
            list: computed(() => props.list),
            allSelect: false,
            allPrice: computed(() => utils.order.countPrice(state.list)),
            disabled: computed(() => state.list.length == 0 ? true : false),
        });


        // 弹窗
        const pop = reactive({
            confirmClear: false,
        });

        // 全选
        const checkAll = (value, label) => {
            state.allSelect = value;
            emit('checkAll', value);

        }


        // 监听变化
        watch(
            () => state.list,
            (list) => {
                // console.log('bottom', list);
                if (state.hasCheck) {
                    if (list.length == 0 || list.length < Number(store.total)) { state.allSelect = false; }
                    else if (list.length == Number(store.total)) {
                        state.allSelect = true;
                    }
                }
            },
            { deep: true }
        );


        //del
        const del = async () => {
            const skuIds = state.list.map(el => el.skuId);
            await store.delItem(skuIds);
            state.allSelect = false;
        }

        // 清空
        const empty = async () => {
            // 请求清空购物车
            await store.empty();
            state.allSelect = false;
        }


        onMounted(() => {
            // console.log('bottom onMounted', props.list);
            if (state.hasCheck && state.allSelect) state.allSelect = false;
        })


        return {
            ...toRefs(state),
            ...toRefs(pop),
            checkAll,
            del,
            empty,
        }
    }
}
</script>

<style lang="scss">
.price-tips {
    display: flex;
    gap: 20px;
}
</style>