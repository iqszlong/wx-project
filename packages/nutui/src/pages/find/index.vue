<template>
  <view class="find">
    <TopBar class="top-bar-bg" :title="title" :setPlace="true"></TopBar>

    <NutCellGroup :title="`版本号${global.version}`" :desc="``">
      <NutCell title="404页面" is-link @click="goPage('/system/pages/notfind/index')"></NutCell>
      <NutCell title="登录页" is-link @click="goPage('/system/pages/login/index')"></NutCell>
    </NutCellGroup>

    <NutCellGroup :title="`杂项测试`" :desc="``">
      <NutCell title="计算器" is-link @click="goPage('/misc/pages/calculator/index')"></NutCell>
    </NutCellGroup>


    <NutCellGroup title='微信原生功能测试'>
      <NutCell>
        <NutSpace wrap>
          <nut-button open-type="share">分享</nut-button>
        </NutSpace>
      </NutCell>
    </NutCellGroup>
    <NutCellGroup title='按钮效果'>
      <NutCell>
        <NutSpace wrap>
          <nut-button type="primary" @click="handleClick('text', msg2, true)">信息提示toast</nut-button>
          <nut-button @click="setRequest">发起测试请求</nut-button>
        </NutSpace>
      </NutCell>
    </NutCellGroup>

    <NutCellGroup title="第三方图标" desc="使用请打开app.js中remixicon.css注释。下方是图标效果。注意：使用后打包文件会增加100k">
      <NutCell>
        <NutSpace wrap>
          <IconFont font-class-name="remixicon" class-prefix="ri" name="home-7-line"></IconFont>
          <nut-button>
            <template #icon>
              <IconFont font-class-name="remixicon" class-prefix="ri" name="delete-bin-5-line"></IconFont>
            </template>
          </nut-button>
        </NutSpace>
      </NutCell>

    </NutCellGroup>

    <NutCellGroup title="原始图标">
      <NutCell>
        <NutSpace wrap>
          <IconFont name="JD"></IconFont>
        </NutSpace>
      </NutCell>
    </NutCellGroup>


    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />



    
  </view>
</template>

<script>
import { useShareAppMessage } from "@tarojs/taro";
import { reactive, toRefs, onMounted, computed } from 'vue';
import utils from "@/utils/index";
import api from "@/api/";
import { useSystemStore } from "@/store/index";
import { IconFont } from '@nutui/icons-vue-taro';

export default {
  name: 'Index',
  components: {
    IconFont
  },
  setup() {

    const store = useSystemStore();

    const {global,router} = utils

    const state = reactive({
      title: '发现',	
      msg: '你成功了～',
      type: 'text',
      show: false,
      cover: false
    });

    const handleClick = (type, msg, cover = false) => {
      state.show = true;
      state.type = type;
      state.cover = cover;
    };


    // 发起请求
    const setRequest = () => {
      api.clickRecord({ name: '点击测试' }).then(res => {
        console.log(res);
      });
    }


    // 微信分享
    useShareAppMessage((res) => {
      let data = {};
      let user = store.user;
      let title = `${user.nickName}向你推荐了小程序`;
      let path = `/pages/notfind/index`;
      // let imgUrl = 'https://img.server.com/picture/Beautyleg/05.25%20No.539%20Lynn%2068pics/0013.jpg';
      if (res.from === "button") {
        // 来自页面内转发按钮
        // console.log(res.target.dataset)
        data = res.target.dataset;
      }
      if (Object.keys(data).length > 0) {
        title = `${user.nickName}向你推荐了${data.name}服务`;
        path = `/pages/contact/detail?id=${user.id}&sid=${data.sid}`;
      }
      return {
        title: title,
        path: path,
        // imageUrl: imgUrl,
        /* 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及JPG。显示图片长宽比是 5:4。*/
        // promise
      };
    });


    onMounted(() => {
      // console.log(utils.global.getValue().version);
    })

    return {
      ...toRefs(state),
      handleClick,
      // 路由文档
      // http://lblblib.gitee.io/tarojs-router-next/guide/quike/start
      goPage: (url) => router.goPage(url, { params: { id: 1 } }),
      setRequest,
      global: computed(() => global.getValue())
    }
  }
}
</script>

<style lang="scss">
img {
  display: block;
  max-width: 100%;
  margin: auto;
}
</style>
