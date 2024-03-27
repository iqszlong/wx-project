<template>
  <LoginView></LoginView>
</template>

<script>
import { reactive, toRefs, onUnmounted } from 'vue';

import { useSystemStore } from '@/store/index';

export default {
  setup() {
    const store = useSystemStore();

    const state = reactive({

    });

    const page = reactive({
      title: '登录',
    });



    onUnmounted(() => {
      // console.log('onUnmounted');
      store.selected = 0;// 重置底部导航选中状态
    })

    return {
      ...toRefs(state),
      ...toRefs(page),
    }
  }
}
</script>

<style lang="scss"></style>
