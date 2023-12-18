<template>
  <view class="my">


    <view>
      <!-- 微信原生获取头像 -->
      <nut-button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <nut-avatar class="avatar" size="large" v-if="userInfo.avatarUrl != null" >
          <img :src="userInfo.avatarUrl"/>
        </nut-avatar>
      </nut-button>
    </view>

    <!-- 微信原生获取昵称 -->
    <nut-input 
      v-model="userInfo.nickName" 
      label="昵称"
      type="nickname"
    />

    <!-- 微信原生获取手机号 -->
    <nut-button open-type="getPhoneNumber" block @getphonenumber="getPhoneNumber">
      获取手机号
    </nut-button>



 
    <nut-cell title="微信登录API" is-link @click="wxLogin"></nut-cell>
    <nut-cell title="获取微信用户信息API" is-link @click="wxUserinfo"></nut-cell>


    <view class="tips">
      微信相关API需要修改project.config.json文件的"appid"
    </view>


    <nut-toast :msg="msg" v-model:visible="show" type="text" :cover="false" />

  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import { Toast } from '@nutui/nutui-taro';
import utils from '@/utils/index';


//const testAvatar = '';
const {wxLogin,wxDevice} = utils;
export default {
  components: {
  },
  data() {
    return {
      title: '我的',
      msg: '',
      show: false,
      userInfo:{
        nickName:'',
        avatarUrl: wxLogin.defaultAvatarUrl,
      },
    }
  },
  methods: {
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail;
      this.userInfo.avatarUrl = null;
      // console.log(avatarUrl);
      const avatarBAse64 = wxDevice.transformImgData(avatarUrl);
      // console.log(avatarBAse64);
      this.$nextTick(() => {
        this.userInfo.avatarUrl =  avatarBAse64;
      })
    },
    getPhoneNumber (e) {
      const {code} = e.detail;
      console.log(code);
      // 取消授权将返回 undefined
      if(code != undefined){
        // 请求
      }
      /*
      需要将 button 组件 open-type 的值设置为 getPhoneNumber，当用户点击并同意之后，
      可以通过 bindgetphonenumber 事件回调获取到动态令牌code，
      然后把code传到开发者后台，并在开发者后台调用微信后台提供的 phonenumber.getPhoneNumber 接口，
      消费code来换取用户手机号。每个code有效期为5分钟，且只能消费一次。
       */
    },
    Login() {
      // console.log('Login');
      Taro.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            this.msg = '用户登录成功';
            this.show = true;
          } else {
            this.msg = '登录失败！' + res.errMsg;
            this.show = true;
          }
        }
      })
    },

    wxLogin() {
      // 检查会话是否过期
      Taro.checkSession({
        success: function () {
          //session_key 未过期，并且在本生命周期一直有效
          this.msg = '用户已登录';
          this.show = true;
        },
        fail: function () {
          // session_key 已经失效，需要重新执行登录流程
          this.msg = '用户未登录，正在重新登录';
          this.show = true;
          this.Login(); //重新登录
        }
      })
    },

    wxUserinfo() {
      // const _self = this;
      Taro.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
          // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
          // console.log('res', res);
          const { userInfo } = res;
          console.log(userInfo);
          this.userInfo.avatarUrl = null;
          this.$nextTick(() => {
            this.userInfo = userInfo;
          });

          this.msg = '获取用户信息成功';
          this.show = true;
          // console.log('this.avatarUrl', this.avatarUrl);

        }, fail: function () {
          this.msg = '获取用户信息失败';
          this.show = true;
        }
      })
    }

  },
}
</script>

<style lang="scss">
.my {
  display: flex;
  flex-direction: column;
  align-items: center;
}


.tips {
  padding: 8px 12px;
}

.avatar-wrapper{
  border:none;
  height: initial;
  padding:0;
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
