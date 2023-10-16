<template>
    <div class="spec-btn">
        <nut-button type="default" size="small" plain @click="showSpecPop">选规格</nut-button>

        <nut-popup pop-class="n-pop-window" round closeable v-model:visible="specsPop" :z-index="100"
            @closed="resetSpec">
            <div class="n-pop-inner">
                <div class="n-pop-header">选规格</div>
                <div class="n-pop-body ">
                    <div class="n-form-item" v-for="(item, index) in specsList">
                        <span class="label">{{ item.name }}</span>
                        <nut-radiogroup v-model="specValueIds[index]" @change="changeSpec($event, item)"
                            direction="horizontal">
                            <nut-radio v-for="value of item.values" shape="button" :label="value.id">{{ value.name }}
                            </nut-radio>
                        </nut-radiogroup>
                    </div>
                </div>
                <div class="n-pop-bottom">
                    <nut-button type="primary" block :disabled="specValueIds.length < specsList.length" @click="getSku"
                        :loading="specBtnloading">确定</nut-button>
                </div>
            </div>
        </nut-popup>

    </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import api from '@/api/index';
import bus from 'vue3-eventbus'
import { useCartStore } from '@/store/index';
export default {
    props: { item: null, },
    emits:['changePopState'],
    setup(props,{emit}) {

        const store = useCartStore();

        const state = reactive({
            ...props,
            specsPop: false,
            specBtnloading: false,
            specsList: [],// 规格参数
            specsCurrent: [],// 当前选中的规格参数内容
            currentItem: null,
        })

        // sku参数
        const skuParams = reactive({
            id: '',// 商品id
            specValueIds: [],// 选中的规格参数
        })

        const showSpecPop = () => {
            bus.emit('showSpecPop', state.item);
            return;
            getSpec(state.item);
        }

        // 获取规格参数
        const getSpec = (item) => {
            state.specsPop = true;
            emit('changePopState',state.specsPop);
            api.getGoodSpecs({ id: item.id }).then(res => {
                const { code, data } = res;
                if (code == 0) {
                    // console.log(data);
                    state.specsList = data;
                    skuParams.id = item.id;
                    state.currentItem = item;
                }
            })
        }
        // 规格参数change事件
        const changeSpec = (value, item) => {
            // console.log(value,item);
            // 选中的规格
            const currentSpec = item.values.find(el => el.id == value);
            if (currentSpec == undefined) return;
            const itemSpec = {
                id: item.id,
                name: item.name,
                spId: currentSpec.id,
                spName: currentSpec.name,
            }
            // console.log(itemSpec);

            const index = state.specsCurrent.findIndex(el => el.id == itemSpec.id)
            if (index < 0) {
                state.specsCurrent.push(itemSpec);
            } else {
                state.specsCurrent[index] = itemSpec;
            }
            // console.log(state.specsCurrent);
        }

        // 关闭窗口重置数据
        const resetSpec = () => {
            // console.log('resetSpec');
            state.specsCurrent = [];
            skuParams.id = '';
            skuParams.specValueIds = [];
            emit('changePopState',state.specsPop);
        }

        // 根据选中的规格获得sku
        const getSku = () => {
            state.specBtnloading = true;
            api.getGoodSku(skuParams).then(res => {
                const { code, data } = res;
                if (code == 0) {
                    const itemData = { ...state.currentItem, skuId: data.id, quantity: 1, specification: `${state.specsCurrent.map(el => el.spName).join(';')}` };
                    // console.log('itemData',itemData);
                    store.addItem(itemData);
                    state.specBtnloading = false;
                    state.specsPop = false;
                    // setTimeout(() => {
                    //   skuParams.id = '';
                    //   skuParams.specValueIds = [];
                    // })

                } else {
                    state.specBtnloading = false;
                }
            })
        }

        return {
            ...toRefs(state),
            ...toRefs(skuParams),
            showSpecPop,
            changeSpec,
            resetSpec,
            getSku,

        }
    }
}
</script>

<style lang="scss">
.spec-btn{
    position: relative;
    z-index: 100;
}
</style>