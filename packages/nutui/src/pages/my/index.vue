<template>
  <LoginView v-if="!hasToken" :path="path"></LoginView>
  <view v-else class="my">
    <view class="user-header-card" :style="{backgroundImage:`url(${bg})`}">
      <div class="inner" v-if="userInfo == null">
        <nut-avatar class="avatar" size="large" :url="defaultAvatar">
        </nut-avatar>
        登录中……
      </div>
      <div v-else class="inner" @click="goPage('/pages/my/baseInfo')">
        <nut-avatar class="avatar" size="large" :url="userInfo.avatarUrl">
        </nut-avatar>
        {{userInfo.nickName}}
      </div>
    </view>

    <div class="panel-layout">
      <div class="n-card">
        <nut-grid :column-num="4" :border="false" clickable>
          <nut-grid-item class="grid-item" @click="goPage('/shop/pages/order/order',{params:{status:1}})">
            <nut-icon size="24" font-class-name="remixicon" class-prefix="ri" name="coin-line" />
            <span>待付款</span>
          </nut-grid-item>
          <nut-grid-item class="grid-item" @click="goPage('/shop/pages/order/order',{params:{status:4}})">
            <nut-icon size="24" font-class-name="remixicon" class-prefix="ri" name="chat-smile-2-line" />
            <span>待评价</span>
          </nut-grid-item>
          <nut-grid-item class="grid-item" @click="goPage('/shop/pages/order/order',{params:{status:5}})">
            <nut-icon size="24" font-class-name="remixicon" class-prefix="ri" name="exchange-cny-line" />
            <span>退款/售后</span>
          </nut-grid-item>
          <nut-grid-item class="grid-item" @click="goPage('/shop/pages/order/order')">
            <nut-icon size="24" font-class-name="remixicon" class-prefix="ri" name="file-list-3-line" />
            <span>全部订单</span>
          </nut-grid-item>
        </nut-grid>
      </div>

      <nut-cell-group>
        <nut-cell title="我的地址" is-link @click="goPage('/settings/pages/address/index')"></nut-cell>
        <nut-cell title="设置" is-link @click="goPage('/settings/pages/index/index')"></nut-cell>
      </nut-cell-group>

    </div>


    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />

  </view>
</template>

<script>
import { reactive, toRefs, computed } from 'vue';

import utils from '@/utils/index';

import { useSystemStore } from '@/store/index';


export default {
  components: {
  },
  onShow() {
    // console.log('onShow');
    this.hasToken = utils.wxLogin.hasToken();
  },
  setup() {

    const store = useSystemStore();

    const page = reactive({
      title: '我的',
      path: '/pages/my/index',
    })


    const img = {
      bg:`${process.env.FILEHOST}/common/mesh-bg.jpg`
    }


    const tips = reactive({
      msg: '',
      show: false,
      cover: false,
      type: 'text',
    });

    const state = reactive({
      hasToken: false,
      userInfo: computed(() => store.user),// 用户数据
      bg:img.bg,
    });


    return {
      ...toRefs(state),
      ...toRefs(tips),
      ...toRefs(page),
      goPage: (url,data) => utils.router.goPage(url,data),
      defaultAvatar: utils.wxLogin.defaultAvatarUrl,
    }
  },
  methods: {


  },
}
</script>

<style lang="scss">
.my {
  display: flex;
  flex-direction: column;

}


.user-header-card {
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;

  .inner {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
  }
}

.panel-layout {
  margin-top: -30px;
  padding-left: 16px;
  padding-right: 16px;

  display: flex;
  flex-direction: column;
  // gap: 16px;

  .n-card {
    padding: 0;
    overflow: hidden;
  }

  .grid-item{
    font-size: 12px;
    color: #666;

    .nut-grid-item__content{
      gap: 8px;
    }
  }
}

.tips {
  padding: 8px 12px;
}
</style>
