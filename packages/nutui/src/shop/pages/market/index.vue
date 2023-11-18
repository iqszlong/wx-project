<template>
  <LoginView v-if="!hasToken" :path="path"></LoginView>
  <PageLoading v-else-if="loading"></PageLoading>
  <div v-else class="market">

    <locationBtn ref="local"></locationBtn>

    <div class="n-tab-wrapper">
      <div class="n-tab">
        <div :class="['item', cagCurrent == tabitem.id ? 'active' : '']" v-for="tabitem of cagList" :key="tabitem.id"
          @click="tabChange(tabitem.id)">
          {{ tabitem.name }}</div>
      </div>
      <div class="n-tab-panel">

        

        <PageLoading v-if="listLoading"></PageLoading>

        <div v-else class="product-list">
          <div class="product-item" v-for="item of productList" :key="item.id">
            <goodItem :img-url="item.mainPicUrl" :title="item.name" :price="`${item.sellPrice}`" :data="item" readonly
              @linkClick="goPage('/shop/pages/market/detail', { params: { id: item.id }, data: item })">
              <template #origin>
                <nut-price class="price-origin" :price="item.originalPrice" size="small" />
              </template>
            </goodItem>
          </div>
        </div>

      </div>
    </div>
    <!-- n-tab-wrapper -->

    <minShopCart ref="minShopCart"></minShopCart>

    <nut-popup pop-class="n-pop-window" round closeable v-model:visible="specsPop" :z-index="100" @closed="resetSpec">
      <div class="n-pop-inner">
        <div class="n-pop-header">选规格</div>
        <div class="n-pop-body ">
          <div class="n-form-item" v-for="(item, index) in specsList">
            <span class="label">{{ item.name }}</span>
            <nut-radiogroup v-model="specValueIds[index]" @change="changeSpec($event, item)" direction="horizontal">
              <nut-radio v-for="value of item.values" shape="button" :label="value.id">{{ value.name }}</nut-radio>
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
import { computed, reactive, toRefs, ref } from 'vue';
import bus from 'vue3-eventbus'
import api from '@/api/index';
import utils from '@/utils/index';
import { useCartStore, useShopStore } from '@/store/index';
export default {
  components: {
  },
  onShow() {
    // console.log('onShow');
    this.hasToken = utils.wxLogin.hasToken();
    if (this.hasToken) {
      this.reload();
      // if (this.$refs.minShopCart) this.$refs.minShopCart.reload();
    }
  },
  setup() {

    const minShopCart = ref(null);

    const cartStore = useCartStore();
    const shopStore = useShopStore();

    bus.on('syncData', () => syncData());// 触发同步购物车与商品列表数量
    bus.on('showSpecPop', (item) => getSpec(item)); // 触发显示规格弹窗
    bus.on('reloadList', () => reloadList()); //刷新商品列表

    const page = reactive({
      title: '校园超市',
      path: '/shop/pages/market/index',
      loading: true, // 加载
      listLoading: true, // 商品列表加载
      specBtnloading: false, // 规格按钮加载
    })

    const state = reactive({
      hasToken: false,
      cagCurrent: computed(() => shopStore.marketCag), // 分类选中
      cagList: [], // 分类列表
      productList: [], // 商品列表
      shopCartList: computed(() => cartStore.shopCartList),// 购物车列表
      specsList: [],// 规格参数
      specsCurrent: [],// 当前选中的规格参数内容
      currentItem: null, // 当前商品数据
    });


    // sku参数
    const skuParams = reactive({
      id: '',// 商品id
      specValueIds: [],// 选中的规格参数
    })

    const pop = reactive({
      specsPop: false,
    })

    // 分页参数
    const params = reactive({
      pageNo: 1, pageSize: 100, categoryId: computed(() => state.cagCurrent),
    });


    // 获取接口数据
    const getData = async () => {
      await getCag();
      await getGoods();
      page.loading = false;
    }

    // 获取分类
    const getCag = async () => {
      const _cag = await api.getGoodsCag({type:0});
      state.cagList = _cag.data;
      if (state.cagCurrent == null) shopStore.marketCag = state.cagList[0].id;// 默认选中第一个选卡
      // state.cagCurrent = state.cagList[0].id; // 默认选中第一个选卡
    }

    // 获取商品分页列表
    const getGoods = async () => {
      // console.log(params);
      const _goods = await api.getGoodsList(params);
      // console.log(_goods.data);
      // console.log(state.productList);
      state.productList = state.productList.concat(_goods.data.list);
      syncData();
      page.listLoading = false;
    }

    // 获取规格参数
    const getSpec = (item) => {
      pop.specsPop = true;
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
      console.log('resetSpec');
      state.specsCurrent = [];
      skuParams.id = '';
      skuParams.specValueIds = [];
    }

    // 根据选中的规格获得sku
    const getSku = () => {
      page.specBtnloading = true;
      api.getGoodSku(skuParams).then(res => {
        const { code, data } = res;
        if (code == 0) {
          const itemData = { ...state.currentItem, skuId: data.id, quantity: 1, specification: `${state.specsCurrent.map(el => el.spName).join(';')}` };
          // console.log('itemData',itemData);
          // store.dispatch('addToShopCart',itemData);
          cartStore.addItem(itemData);
          page.specBtnloading = false;
          pop.specsPop = false;
          // setTimeout(() => {
          //   skuParams.id = '';
          //   skuParams.specValueIds = [];
          // })

        } else {
          page.specBtnloading = false;
        }
      })
    }



    // 重载页面
    const reload = () => {
      state.cagList = [];
      state.productList = [];
      getData();

    }

    // 重载商品列表
    const reloadList = () => {
      state.productList = [];
      getGoods();
    }

    // 分类切换
    const tabChange = async (id) => {
      // console.log(title, paneKey, disabled);
      // console.log(state['cagCurrent']);
      // console.log(id);
      // state.cagCurrent = id;
      shopStore.marketCag = id;
      page.listLoading = true;
      reloadList();
    }

    // 对比购物车和商品 调整商品数量
    const syncData = () => {
      // console.log('syncData 同步数据');
      state.productList.forEach(el => {
        const findItem = state.shopCartList.find(cartItem => cartItem.goodsId == el.id);
        if (findItem != undefined) {
          el.quantity = findItem.quantity;
        } else {
          el.quantity = 0;
        }
        // console.log(el.quantity);
      })
    }



    return {
      minShopCart,
      ...toRefs(state),
      ...toRefs(page),
      ...toRefs(params),
      ...toRefs(pop),
      ...toRefs(skuParams),
      reload,
      tabChange,
      syncData,
      getSku,
      changeSpec,
      resetSpec,
      goPage:(url,data)=> utils.router.goPage(url,data),
    }
  }
}
</script>

<style lang="scss">
.market {
  display: flex;
  flex-direction: column;
  height: 100%;


}

.n-tab-wrapper {
  flex: 1;
  display: flex;

  .n-tab {
    background: $help-color;
    box-sizing: border-box;
    flex-basis: 80px;
    flex-shrink: 0;
    flex-grow: 0;
    height: calc(100vh - 28px);
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 80px;

    .item {
      position: relative;
      z-index: 1;
      min-height: 40px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px 0 0 8px;
      padding: auto 10px;


      &:nth-child(1) {
        border-radius: 0 0 0 8px;
      }


      &::before {
        content: '';
        position: absolute;
        z-index: 1;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 16px;
      }

      &.active {
        background: $white;
        font-weight: bolder;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

        &::before {
          background: $primary-color;
        }
      }
    }
  }

  .n-tab-panel {
    flex: 1;
    background: $white;
    flex-shrink: 0;
    height: calc(100vh - 28px);
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 80px;
    box-sizing: border-box;

  }
}
</style>
