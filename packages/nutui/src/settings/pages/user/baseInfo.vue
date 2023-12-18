<template>
  <view class="base-info">


    <view class="info-head">
      <!-- 微信原生获取头像 -->
      <nut-button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <nut-avatar class="avatar" size="large">
          <img  :src="user == null ? defaultAvatarUrl : user.avatarUrl"/>
        </nut-avatar>
      </nut-button>
    </view>



    <!-- 微信原生获取昵称 -->
    <nut-input v-model="user.nickName" label="昵称" type="nickname" @blur="nickChange" />

    <nut-input v-model="user.phone" label="手机号" type="text">
      <template #right>
        <nut-button size="small" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">获取微信手机号</nut-button>
      </template>
    </nut-input>

    <div class="n-form-item">
      <div class="label">
        性别
      </div>
      <nut-radio-group v-model="user.gender" direction="horizontal">
        <nut-radio shape="button" :label="0">未知</nut-radio>
        <nut-radio shape="button" :label="1">男</nut-radio>
        <nut-radio shape="button" :label="2">女</nut-radio>
      </nut-radio-group>
    </div>

    <div v-if="user.id" class="n-form-item">
      <div class="label">
        UID
      </div>
      {{ user.id }}
    </div>





    <!-- <view class="tips">
      微信相关API需要修改project.config.json文件的"appid"
    </view> -->




    <div class="n-bottom-ctrl">
      <div class="item">
        <nut-button block type="primary" :disabled="disabled" :loading="saveLoading" @click="save">保存</nut-button>
      </div>
    </div>

    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />

  </view>
</template>

<script>

import { reactive, toRefs, watch, onMounted, computed, nextTick } from 'vue';
import utils from '@/utils/';
import api from '@/api/index';
import { useSystemStore } from '@/store/index';

export default {
  components: {
  },
  setup() {

    const store = useSystemStore();
    const {wxDevice} = utils;

    // 页面数据
    const pageData = reactive({
      user: utils.wxLogin.defaultUser,// 获取默认数据
      disabled: true,
      saveLoading: false,
    });

    const tips = reactive({
      msg: '',
      show: false,
      cover: false,
      type: 'text',
    });

    const state = reactive({
      title: '基本信息',
      userInfo: computed(() => store.user),// 用户数据
      defaultAvatarUrl: utils.wxLogin.defaultAvatarUrl,
    });



    onMounted(() => {
      // console.log('onMounted');
      // pageData.user = JSON.parse(JSON.stringify(state.userInfo));
      getData();
    });

    const getData = () => {
      api.getUserInfo().then(res => {
        const { code, data, msg } = res;
        if (code == 0) {
          pageData.user = JSON.parse(JSON.stringify(data));
        } else {
          tips.msg = msg;
          tips.show = true;
          tips.type = 'warn';
        }
      })
    }

    const nickChange = (e) => {
      console.log(e);
      pageData.user.nickName = e.detail.value;
    }



    watch(
      () => pageData.user,
      (user) => {
        if (JSON.stringify(user) == JSON.stringify(state.userInfo)) {
          pageData.disabled = true;
        } else {
          pageData.disabled = false;
        }
      }, { deep: true }
    );

    const onChooseAvatar = (e) => {
      const { avatarUrl } = e.detail;
      // console.log(avatarUrl);
      pageData.user.avatarUrl = null;
      const avatarBAse64 = wxDevice.transformImgData(avatarUrl);
      nextTick(() => {
        pageData.user.avatarUrl = avatarBAse64;
      })
    }


    const getPhoneNumber = (e) => {
      const { code } = e.detail;
      // console.log(code);
      // 取消授权将返回 undefined
      if (code != undefined) {
        // 请求
        api.wxPhone({ code }).then(res => {
          const { code, data, msg } = res;
          if (code == 0) {
            pageData.user.phone = data.phoneNumber;
          } else {
            tips.msg = msg;
            tips.show = true;
            tips.type = 'warn';
          }
        })
      }
      /*
      需要将 button 组件 open-type 的值设置为 getPhoneNumber，当用户点击并同意之后，
      可以通过 bindgetphonenumber 事件回调获取到动态令牌code，
      然后把code传到开发者后台，并在开发者后台调用微信后台提供的 phonenumber.getPhoneNumber 接口，
      消费code来换取用户手机号。每个code有效期为5分钟，且只能消费一次。
       */
    }

    const save = () => {
      // console.log('====================================');
      // console.log(pageData.user);
      // console.log('====================================');
      pageData.saveLoading = true;
      api.editUserInfo({ ...pageData.user }).then(res => {
        const { code, msg } = res;
        if (code == 0) {
          tips.msg = '更新成功';
          tips.show = true;
          tips.type = 'success';
          tips.cover = true;
          store.setUserInfo(pageData.user);
          pageData.saveLoading = false;
        } else {
          tips.msg = msg;
          tips.show = true;
          tips.type = 'warn';
          tips.cover = true;
          pageData.saveLoading = false;
        }
      })
    }


    return {
      ...toRefs(state),
      ...toRefs(pageData),
      ...toRefs(tips),
      onChooseAvatar,
      getPhoneNumber,
      save,
      nickChange,
    }
  },

}
</script>

<style lang="scss">
.base-info {
  display: flex;
  flex-direction: column;
  align-items: center;

  .nut-radiogroup .nut-radio {
    margin-bottom: 0;
  }

}

.info-head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.tips {
  padding: 8px 12px;
}

.avatar-wrapper {
  border: none;
  height: initial;
  padding: 0;
  border-radius: 50%;
}

.avatar {
  display: block;

  img,
  .h5-img {
    display: block;
    object-fit: cover;
  }
}
</style>
