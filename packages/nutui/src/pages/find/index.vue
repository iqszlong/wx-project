<template>
  <view class="find">
    <TopBar :title="title"></TopBar>
    {{ msg }}

    <img src="https://img.server.com/picture/imgtemp/RM036.jpg" :style="{width:'100%'}" alt="" mode="widthFix" />

    <nut-icon font-class-name="remixicon" class-prefix="ri" name="home-7-line" />
    <nut-button type="primary" icon-font-class-name="remixicon" icon-class-prefix="ri" icon="delete-bin-5-line">
    </nut-button>
    <nut-button type="default">
    </nut-button>

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
