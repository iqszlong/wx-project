<template>
  <view class="find">
    <TopBar class="top-bar-bg" :title="title" :setPlace="true"></TopBar>




    发现页面
   

    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script>
import { reactive, toRefs } from 'vue';
export default {
  components: {
  },
  setup() {
    const state = reactive({
      title: '发现',
    });

    const tips = reactive({
      msg: '',
      show: false,
      cover: false,
      type: 'text',
    });

    return {
      ...toRefs(state),
      ...toRefs(tips),
    }
  }
}
</script>

<style lang="scss">

</style>
