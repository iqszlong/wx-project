<template>
  <view class="order-list">
    <div class="n-top-ctrl">
      <div class="n-nav-tab">
        <div :class="['item', current == item.value ? 'active' : null]" v-for="item of statusList"
          @click="current = item.value; showStatus = item.value; reload()">{{ item.name }}</div>
      </div>
    </div>

    <!-- <scroll-view class="scroll-view" :scrollY="true" :scrollAnchoring="true" :refresherEnabled="true"
      @ScrollToLower="changePage" @RefresherRefresh="reload" :refresherTriggered="loading"> -->

    <div v-if="loading" class="n-loading">
      <nut-icon size="32px" name="loading"></nut-icon>
    </div>
    <template v-else-if="list.length == 0">
      <div class="n-empty">
        <nut-empty image="empty" description="无内容"></nut-empty>
      </div>
    </template>
    <template v-else>
      <nut-cell class="order-item" v-for="item of list">
        <div class="order-inner" @click="goPage('/pages/order/detail', { params: { id: item.id } })">
          <div class="order-header">
            订单号:{{ item.orderSn }}
            <div class="n-space"></div>
            <span>{{ item.statusText }}</span>
          </div>


          <shopCartItem class="min" v-for="goods of item.goodsList" :img-url="goods.picUrl" :title="goods.goodsName"
            :price="`${goods.price}`" :data="goods">
            <template #footer>
              <div>
                x{{ goods.quantity }}
                <!-- <nut-price :price="goods.totalPrice" size="normal" :decimal-digits="2" /> -->
              </div>

            </template>
          </shopCartItem>

          <div class="order-price">
            <div class="n-space"></div>
            <span>
              商品费用
              <nut-price :price="item.goodsPrice" size="small" :decimal-digits="2" />
            </span>
            <span>
              配送费用
              <nut-price :price="item.freightPrice" size="small" :decimal-digits="2" />
            </span>
            <span>
              实付
              <nut-price :price="item.actualPrice" size="large" :decimal-digits="2" />
            </span>
          </div>

        </div>
        <div class="order-footer">
          <div class="n-space"></div>
          <refundBtn v-if="item.handleOption.refund" :orderId="`${item.id}`" @refunded="reload" text="申请退款"></refundBtn>
          <!-- <nut-button v-if="item.handleOption.aftersale" size="small">申请售后</nut-button> -->
          <cancelBtn v-if="item.handleOption.cancel" :orderId="`${item.id}`" @canceled="reload" text="取消订单">
          </cancelBtn>
          <payBtn v-if="item.handleOption.pay" :orderId="`${item.id}`" @payed="reload" text="付款">
          </payBtn>
          <rebuyBtn v-if="item.handleOption.rebuy" :orderId="`${item.id}`" text="再来一单"></rebuyBtn>
          <confirmBtn v-if="item.handleOption.confirm" :orderId="`${item.id}`" @confirm="reload" text="确认收货"></confirmBtn>
          <delBtn v-if="item.handleOption.delete" :orderId="`${item.id}`" @deled="reload" text="删除订单"></delBtn>

        </div>
      </nut-cell>
    </template>

    <!-- </scroll-view> -->

  </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import { Router } from "tarojs-router-next"; // 路由库
import api from '@/api/';
import utils from '@/utils/';
export default {
  components: {
  },
  setup() {

    const routerParams = Router.getParams();

    const state = reactive({
      current: 0,
      statusList: [{
        name: '全部',
        value: 0,
      }, {
        name: '待付款',
        value: 1,
      }, {
        name: '待发货',
        value: 2,
      }, {
        name: '待收货',
        value: 3,
      }, {
        name: '待评价',
        value: 4,
      }, {
        name: '退款/售后',
        value: 5,
      }]
    });

    const params = reactive({
      pageNo: 1,
      pageSize: 20,
      showStatus: null
    })

    const pageData = reactive({
      loading: true,
      list: [],
      total: 0,
    })

    const getData = () => {
      api.getOrder(params).then(res => {
        const { code, data } = res;
        if (code == 0) {
          // console.log(data);
          pageData.list = pageData.list.concat(data.list);
          pageData.total = data.total;
          pageData.loading = false;
        }
      })
    }

    // 滚动到底部触发翻译
    const changePage = () => {
      // console.log('changePage');
      if (params.pageNo * params.pageSize < pageData.total) {
        params.pageNo++;
        getData();
      }
    }

    onMounted(() => {
      state.current = routerParams.status || 0;
      params.showStatus = routerParams.status || 0;
      getData();
    })

    const reload = () => {
      pageData.loading = true;
      pageData.list = [];
      pageData.total = 0;
      getData();
    }

    return {
      ...toRefs(state),
      ...toRefs(params),
      ...toRefs(pageData),
      reload,
      changePage,
      goPage: (url, data) => utils.router.goPage(url, data)
    }
  }
}
</script>

<style lang="scss">
.order-list {
  padding-top: 46px;
  box-sizing: border-box;
  min-height: 100%;

  .scroll-view {
    height: 100%;
  }

}


.order-item {
  flex-direction: column;
  gap: 16px;

  .order-inner {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .order-header {
    display: flex;
    gap: 8px;
    font-size: 12px;
  }

  .order-footer,
  .order-price {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>
