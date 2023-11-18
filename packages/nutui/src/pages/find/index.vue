<template>
  <view class="find">
    <TopBar class="top-bar-bg" :title="title" :setPlace="true"></TopBar>


    <!-- <img src="https://img.server.com/picture/imgtemp/RM036.jpg" :style="{width:'100%'}" alt="" mode="widthFix" /> -->

    <IconFont font-class-name="remixicon" class-prefix="ri" name="home-7-line" ></IconFont>
   

    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { IconFont } from '@nutui/icons-vue-taro';
export default {
  components: {
    IconFont
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
