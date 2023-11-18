<template>

  <LoginView v-if="!hasToken" :path="path"></LoginView>
  <view v-else class="cart">
    <!-- <div class="n-page-header">
      <div class="title">
        {{title}}
      </div>
    </div> -->
    <div class="top-ctrl">
      <locationBtn ref="local"></locationBtn>
      <div class="n-space"></div>
      <nut-button size="small" @click="editToggle" style="border:none">{{editTip}}</nut-button>
    </div>
    <ShopCartList ref="list" hasCheck @getSelect="getSelect">

    </ShopCartList>

    <bottomCtrl ref="bottom" hasCheck hasNav :edit="edit" :list="selectList" @checkAll="selectAll">
      <template #btn>
        <nut-button type="primary" :disabled="disabled" @click="settlement">去结算</nut-button>
      </template>
    </bottomCtrl>

  </view>

</template>

<script>
import { reactive, toRefs, ref, computed } from 'vue';
import utils from '@/utils/index';
export default {
  components: {
  },
  onShow() {
    // console.log('show');
    // 显示页面时刷新页面
    this.hasToken = utils.wxLogin.hasToken();
    if (this.hasToken) {
      if (this.$refs.list) this.$refs.list.reload();
      if (this.$refs.local) this.$refs.local.reload();
    }
  },
  onHide() {
    this.selectList = [];
  },
  setup() {

    // const store = useStore();
    // 路由参数
    // const data = Router.getData();
    // console.log('data',data);
    const local = ref(null);
    const list = ref(null);
    const bottom = ref(null);

    // 页面信息
    const page = reactive({
      title: '购物车',
      path: '/pages/cart/index',
    })


    const state = reactive({
      hasToken: false,
      edit: false,
      editTip: '编辑',

    });

    // 底部数据
    const bottomData = reactive({
      selectList: [],
      disabled: computed(() => bottomData.selectList.length == 0 ? true : false),
    });


    // 清空购物车
    const editToggle = () => {
      console.log('切换编辑模式');
      state.edit = !state.edit;
      state.editTip = state.edit ? '完成' : '编辑';
    }





    // 结算
    const settlement = () => {
      // 进入下单页面
      const selectedList = JSON.parse(JSON.stringify(bottomData.selectList));
      // console.log(selectedList);
      utils.router.goPage('/shop/pages/order/index', { data: selectedList })
    }


    // 获取已选列表
    const getSelect = (list) => {
      bottomData.selectList = list;
      // console.log(list);
    }

    //全选
    const selectAll = (value) => {
      // console.log(value);
      list.value.checkAll(value);
    }








    return {
      local,
      list,
      bottom,
      ...toRefs(state),
      ...toRefs(page),
      ...toRefs(bottomData),
      editToggle,
      settlement,

      getSelect,
      selectAll,
    }
  }
}
</script>

<style lang="scss">
.top-ctrl {
  display: flex;
  padding: 8px 16px;
  align-items: center;
}
</style>
