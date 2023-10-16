<template>
  <view class="setting">
    <nut-cell-group>
      <nut-cell title="个人设置" is-link @click="goPage('/pages/my/baseInfo')"></nut-cell>
    </nut-cell-group>


    <div class="n-bottom-ctrl">
      <div class="item">
        <nut-button block type="primary" @click="logOut">退出登录</nut-button>
      </div>
    </div>

    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />

  </view>
</template>

<script>
import { reactive, toRefs } from 'vue';
import utils from '@/utils/index';

export default {
  components: {
  },
  setup() {

    const state = reactive({

    });

    const tips = reactive({
      msg: '设置',
      show: false,
      cover: false,
      type: 'text',
    });

    const logOut = () => {

      tips.msg = "退出成功";
      tips.type = "success";
      tips.show = true;
      tips.cover = true;

      setTimeout(() => {
        utils.user.userLogout(); // 用户退出
      }, 500);
    }



    return {
      ...toRefs(tips),
      ...toRefs(state),
      logOut,
      goPage: (url) => utils.router.goPage(url),
    }
  }
}
</script>

<style lang="scss">

</style>
