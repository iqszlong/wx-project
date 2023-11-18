<template>
    <PageLoading v-if="loading"></PageLoading>
    <template v-else-if="productList.length == 0">
        <div class="n-empty">
            <nut-empty image="empty" description="无内容"></nut-empty>
        </div>
    </template>
    <template v-else>



        <div class="product-list">
            <div class="product-item" v-for="item of productList" :key="item.id">
                <nut-checkbox v-if="hasCheck" class="customize" v-model="item.selected" @change="selectedChange">
                </nut-checkbox>
                <shopCartItem :img-url="item.goodsPicUrl" :title="item.goodsName" :price="`${item.goodsPrice}`"
                    :data="item" :min="1" @linkClick="goPage('/pages/market/detail', { params: { id: item.goodsId }, data: item })">

                </shopCartItem>
            </div>
        </div>






    </template>
</template>

<script>
import { reactive, toRefs, onMounted, computed, } from 'vue';
import { useCartStore } from "@/store/";
import { storeToRefs } from 'pinia';

import goodItem from '@/components/goodItem/index';
import utils from '@/utils/index';


export default {
    name: 'shop-cart-list',
    components: {
        goodItem,
    },
    props: {
        hasCheck: {
            type: Boolean,
            default: false
        },
        edit: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: [],
        }
    },
    emits: ['getSelect'],
    setup(props, { emit }) {

        // 购物车存储
        const store = useCartStore();

        // page 状态
        const page = reactive({
            loading: false,
        });

        const state = reactive({
            productList: computed(() => store.shopCartList),
            selectedList: [],
            total: 0,
        })



        onMounted(() => {
            
        });

        // 选中事件变化
        const selectedChange = (value, label) => {
            state.selectedList = state.productList.filter(el => el['selected'] == true);
            emit('getSelect', state.selectedList);

        }


        // 全选change事件
        const checkAll = (value) => {
            // console.log(value);
            if (value) {
                state.productList.forEach(el => {
                    el['selected'] = true;
                });
                state.selectedList = state.productList;
                emit('getSelect', state.selectedList);

            } else if (state.selectedList.length == state.productList.length) {
                state.productList.forEach(el => {
                    el['selected'] = false;
                });
                state.selectedList = [];
                emit('getSelect', state.selectedList);
            }
        }




        // 刷新
        const reload = () => {
            console.log('reload');
            if (page.loading == true) return; // 如果已经发起请求则取消刷新
            page.loading = true;
            reloadShopCart();
        }




        // 刷新读取购物车
        const reloadShopCart = async () => {
            store.$reset();
            await store.getList();
            page.loading = false;
        }

        return {
            ...toRefs(page),
            ...toRefs(state),
            selectedChange,
            checkAll,
            goPage:(url,data)=> utils.router.goPage(url,data),
            reload,
        }
    },
}
</script>

<style lang="scss">
.price-tips {
    display: flex;
    gap: 8px;
}
</style>