<template>
  <view class="index">
    <TopBar class="top-bar-bg" title="首页" :setPlace="true"></TopBar>
    <nut-swiper class="banner" :pagination-visible="true" pagination-color="#ffffff" auto-play="3000">
      <nut-swiper-item v-for="(item, index) in banners" :key="index">
        <img class="banner-img" :src="item.path" alt="" mode="widthFix" />
      </nut-swiper-item>
    </nut-swiper>


    <view class="container">
      <view class="main-panel">
        <view class="user-header">
          <view class="welcome">
            <view class="hello">Hello<span v-if="user != null">{{ user.nickName }}</span></view>
            {{ msg }}
          </view>
          <div class="n-space"></div>

          <nut-button v-if="user == null" type="primary" @click="userLogin();">立即登录
          </nut-button>
          <template v-else>
            <div @click="goPage('/settings/pages/user/baseInfo')">
              <userAvatar ref="avatar"></userAvatar>
            </div>
          </template>
        </view>
        <nut-divider :style="{ color: '#dddddd', borderColor: '#dddddd' }" />

        <view class="grid-links">
          <nut-cell class="grid-item" v-for="(item, index) in gridLinks" :key="index" is-link center right-icon=""
            @click="goPage(item.url);">
            <IconFont :name="item.icon" class="icon" size="24"></IconFont>
            <!-- <img class="icon" :src="item.icon" mode="widthFix" /> -->
            <view>{{ item.title }}</view>
          </nut-cell>
        </view>

      </view>


    </view>

  </view>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from 'vue';
import { useSystemStore } from '@/store/index';
import { IconFont } from '@nutui/icons-vue-taro';
import utils from "@/utils/index";

export default {
  name: 'Index',
  components: {
    IconFont
  },
  setup() {

    const store = useSystemStore();




    const state = reactive({
      hasToken: false,
      msg: '欢迎使用 NutUI 开发小程序',
      msg2: '',
      type: 'text',
      show: false,
      cover: false,
      user: computed(() => store.user),
      banners: [{
        path: 'https://storage.360buyimg.com/jdc-article/NutUItaro34.jpg',
      }, {
        path: 'https://storage.360buyimg.com/jdc-article/NutUItaro2.jpg',
      }, {
        path: 'https://storage.360buyimg.com/jdc-article/welcomenutui.jpg',
      }, {
        path: 'https://storage.360buyimg.com/jdc-article/fristfabu.jpg'
      }],
      gridLinks: [{
        title: '校园超市',
        name: 'supermarket',
        icon: 'shop',
        url: ''
      },
      {
        title: '校园外卖',
        name: 'takeout',
        icon: 'dshop',
        url: ''
      },
      {
        title: '云打印',
        name: 'cprint',
        icon: 'footprint',
        url: ''
      },
      {
        title: '校园洗衣房',
        name: 'laundryRoom',
        icon: 'refresh2',
        url: ''
      }, {
        title: '校园驾校',
        name: 'drivingSchool',
        icon: 'jdl',
        url: ''
      }, {
        title: '电瓶车回购',
        name: 'electricalRecycling',
        icon: 'order',
        url: ''
      }, {
        title: '快递代取',
        name: 'courier',
        icon: 'people',
        url: ''
      }, {
        title: '跳蚤市场',
        name: 'oldGoods',
        icon: 'date',
        url: ''
      }
      ]
    });


    // 登录按钮
    const userLogin = () => {
      // console.log(utils);
      // 用户登录
      utils.user.userLogin({}, () => {
        utils.router.goHomeRelaunch(); // 重定位到首页
      });
    }

    onMounted(() => {
      // console.log(utils.global.getValue().version);
    })

    return {
      ...toRefs(state),
      userLogin,
      goPage: (url) => utils.router.goPage(url),
    }
  }
}
</script>

<style lang="scss">
.index {
  .container {
    position: relative;
    z-index: 1;
    // margin-top: -65px;
    // margin-left: 15px;
    // margin-right: 15px;
  }


}

.banner {
  display: block;
  width: 100%;
  height: auto;
  background: #aaa;
  // aspect-ratio: 750/776;

  .nut-swiper-item {
    line-height: 150px;
  }

  .banner-img {
    width: 100%;
    height: 100%;
  }

  .nut-swiper-pagination {
    // margin-bottom: 75px;

    .h5-i {
      opacity: 0.3;
      background-color: #fff;
    }

    .active {
      width: 28px;
      opacity: 1;
    }
  }
}

.main-panel {
  // background: #fff;
  // box-shadow: 0px 0px 6px 5px rgba(0, 0, 0, 0.06);
  // border-radius: 8px;
  padding: 24px;
  // min-height: 200px;
  margin-bottom: 12px;
}

.user-header {
  display: flex;
  align-items: flex-end;

  .welcome {
    // padding-right: 60px;
    line-height: 1.2;
    max-width: 140px;
  }

  .hello {
    padding-bottom: 8px;
    display: flex;
    gap: 8px;
  }
}

.grid-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 12px 16px;

  .grid-item {
    flex-direction: column;
    padding: 8px 0;
    margin: 0;
    box-shadow: none;
    justify-content: center;
    font-size: 12px;
    gap: 8px;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.06);
  }

  .icon {
    width: 44px;
    height: 44px;
  }
}

.img-card {
  overflow: hidden;
  display: block;
  box-shadow: 0px 0px 6px 5px rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  background: #fff;
  padding: 0;
  margin: 0 0 12px;

  .img {
    display: block;
    width: 100%;
    height: 108px;
  }
}


.message-pop {
  width: 80%;
  padding: 20px;

  .item-content {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
