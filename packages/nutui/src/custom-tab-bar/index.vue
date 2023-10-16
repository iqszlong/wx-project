<template>
  <nut-tabbar @tab-switch="tabSwitch" v-model:visible="selected" safe-area-inset-bottom>
    <!-- font-class-name="remixicon" class-prefix="ri" -->
    <nut-tabbar-item v-for="(item, index) of menus" :key="index" :tab-title="item.title" :icon="item.icon" :num="item.num">
    </nut-tabbar-item>
  </nut-tabbar>
</template>

<script>
import Taro from '@tarojs/taro';
import { ref ,computed} from 'vue';
import { useSystemStore,useCartStore } from '@/store/'
import { storeToRefs } from 'pinia'
export default {
  setup() {
    const store = useSystemStore();
    const cartSore = useCartStore();
    const { selected } = storeToRefs(store);

    const menus = ref([{
      title: '首页',
      icon: 'home',
      url: '/pages/index/index',
      num: null,
    }, {
      title: '分类',
      icon: 'category',
      url: '/pages/category/index',
      num: null,
    },
    {
      title: '发现',
      icon: 'find',
      url: '/pages/find/index',
      num: null,
    },
    {
      title: '购物车',
      icon: 'cart',
      url: '/pages/cart/index',
      num: computed(() => cartSore.total),
    }, {
      title: '我的',
      icon: 'my',
      url: '/pages/my/index',
      num: null,
    }]);



    function tabSwitch(item, index) {
      // console.log(item, index);
      store.selected = index;
      const mitem = menus.value[index];
      // console.log(mitem.url);
      if (mitem.url == '') return;
      Taro.switchTab({
        url: mitem.url,
      });
    }



    return {
      menus,
      tabSwitch,
      selected,
    };
  },
  options: {
    addGlobalClass: true
  }
}
</script>