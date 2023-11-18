<template>
  <nut-tabbar @tab-switch="tabSwitch" v-model="selected" unactive-color="#7d7e80" active-color="#FF192C" safe-area-inset-bottom placeholder>
    <nut-tabbar-item v-for="(item, index) of menus" :key="index" :tab-title="item.title" :icon="item.icon" :value="item.num">
    </nut-tabbar-item>
  </nut-tabbar>
</template>

<script>
import Taro from '@tarojs/taro';
import { Home, Category, Find, Cart, My } from '@nutui/icons-vue-taro';
import { ref, computed, h } from 'vue';
import { useSystemStore, useCartStore } from '@/store/'
import { storeToRefs } from 'pinia'
export default {
  components: {
    Home, Category, Find, Cart, My
  },
  setup() {
    const store = useSystemStore();
    const cartSore = useCartStore();
    const { selected } = storeToRefs(store);

    const menus = ref([{
      title: '首页',
      icon: h(Home),
      url: '/pages/index/index',
      num: null,
    }, {
      title: '分类',
      icon: h(Category),
      url: '/pages/category/index',
      num: null,
    },
    {
      title: '发现',
      icon: h(Find),
      url: '/pages/find/index',
      num: null,
    },
    {
      title: '购物车',
      icon: h(Cart),
      url: '/pages/cart/index',
      num: computed(() => cartSore.total),
    }, {
      title: '我的',
      icon: h(My),
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