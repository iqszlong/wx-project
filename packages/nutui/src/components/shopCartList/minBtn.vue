<template>
    <div>
        <div class="n-shop-cart">
            <div class="inner">
                <div class="price-wrapper" @click="() => { if (allPrice > 0) showCartPop = !showCartPop }">
                    <div class="no-price" v-if="allPrice <= 0">未选购商品</div>
                    <nut-price class="price-num" v-else :price="allPrice" size="normal" :need-symbol="true"
                        :decimal-digits="2" />
                </div>

                <nut-button type="primary" :disabled="allPrice <= 0" @click="settlement">去结算({{shopCart.length}})</nut-button>
            </div>
        </div>


        <!-- 购物车弹窗 -->
        <nut-popup class="shop-cart-pop" position="bottom" round v-model:visible="showCartPop" z-index="3">
            <div class="n-pop-inner">
                <div class="n-pop-header">
                    <div class="n-pop-title">购物车</div>
                    <div class="n-space"></div>
                    <nut-button type="default" plain style="border:none" icon="del" @click="confirm = true">清空购物车
                    </nut-button>

                </div>
                <div class="n-pop-body">

                    <nut-cell-group>
                        <nut-cell v-for="item of shopCart" :key="item.id">
                            <!--  -->
                            <shopCartItem class="min" :img-url="item.goodsPicUrl" :title="item.goodsName"
                                :price="`${item.goodsPrice}`" :data="item">

                            </shopCartItem>
                        </nut-cell>
                    </nut-cell-group>

                </div>
            </div>
        </nut-popup>

        <!-- 清空购物车 -->
        <nut-dialog title="清空购物车" v-model:visible="confirm" @cancel="confirm = false" @ok="emptyCart"
            :overlay-style="{ zIndex: 12 }" :pop-style="{ zIndex: 15 }" />


    </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from 'vue'
import utils from '@/utils/index';
import { useCartStore } from '@/store/index';
import bus from "vue3-eventbus";

export default {
    components: {
    },
    setup() {
        const store = useCartStore();

        const state = reactive({
            allPrice: computed(() => store.price), // 购物车小计
            shopCart: computed(() => store.shopCartList), // 购物车列表
        })

        // 弹窗
        const pop = reactive({
            showCartPop: false, // 购物车
            confirm: false, // 购物车清空确认
        });

        //清空购物车
        const emptyCart = async () => {
            await store.empty();
            popState(); // 更新购物车状态
            bus.emit("reloadList");
        }

        // 购物车弹窗调整
        const popState = () => {
            // console.log(state.shopCart);
            if (state.shopCart.length == 0 && pop.showCartPop == true) {
                pop.showCartPop = false;
            }
        }



        // 刷新读取购物车
        const reload = async () => {
            store.$reset();
            await state.getList();
        }

        // 结算
        const settlement = () => {
            pop.showCartPop = false;
            const selectedList = state.shopCart.map(el => { return { ...el } })
            // 进入下单页面
            utils.router.goPage('/pages/order/index', { data: selectedList });

        }

        onMounted(() => {
            store.sumPrice;// 计算价格 如果已有购物车数据
        })

        return {
            ...toRefs(state),
            ...toRefs(pop),
            reload,
            emptyCart,
            settlement,
        }
    }
}
</script>

<style lang="scss">
// 底部购物车条
.n-shop-cart {
    position: fixed;
    z-index: 11;
    padding: 16px 16px 32px;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%);


    .inner {
        display: flex;
        background: #fff;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.16);
        border-radius: 30px;
        align-items: center;
        position: relative;
        z-index: 6;


        .price-wrapper {
            flex: 1;
            padding: 0 16px;
        }

        .price-num {
            color: $required-color;
            font-weight: bold;

            .nut-price--symbol {
                font-size: 10px;
                font-weight: lighter;
            }
        }

    }


}

// 购物车弹窗
.shop-cart-pop {
    .n-pop-body {
        max-height: 60vh;
        padding-bottom: 80px;
    }

    .min {
        .nut-card__left {
            width: 50px;

            >.h5-img {
                width: 50px;
                height: 50px;
            }
        }

        .nut-card__right {
            position: relative;
            z-index: 1;
            padding-bottom: 0;

            .customize {
                position: absolute;
                z-index: 1;
                top: 0;
                right: 0;
            }

            .nut-card__right__title {
                padding-right: 66px;
            }
        }

    }
}
</style>