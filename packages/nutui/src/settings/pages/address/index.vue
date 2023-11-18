<template>
  <view class="my-address">
    <template v-if="list.length == 0">
      <div class="n-empty">
        <nut-empty image="empty" description="无内容"></nut-empty>
      </div>
    </template>
    <nut-addresslist :data="list" :dataMapOptions="dataMapOptions" @handelEditIcon="editClick" @handelDelIcon="delClick"
      @addAddressClick="addAddress">

    </nut-addresslist>

    <nut-dialog title="确认删除" v-model:visible="delPop" @cancel="delPop = false" @ok="delPost" />

    <!-- 消息提示 -->
    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import api from '@/api/index';
import utils from '@/utils/index';

export default {
  components: {
  },
  onShow() {
    this.reload();
  },
  setup() {

    // 提示
    const tips = reactive({
      msg: '我的地址',
      show: false,
      type: 'text',
      cover: false,
    });

    const state = reactive({

      list: [],
      dataMapOptions: {
        id: 'id',
        addressName: 'name',
        phone: 'mobile',
        defaultAddress: 'default',
        fullAddress: 'fullAddress'
      }
    });

    const pop = reactive({
      delPop: false,
    });

    const data = reactive({
      currentItem: null,
    })


    const params = reactive({
      pageNo: 1,
      pageSize: 20,
      default: false,
    })

    // 获取数据
    const getData = async () => {
      const { data, msg } = await api.getAddress(params);

      if (data != undefined) {
        // console.log(data, msg);
        state.list = state.list.concat(data.list);
      }
    }

    // 刷新
    const reload = () => {
      state.list = [];
      getData();
    }


    // 事件
    const editClick = async (e, item) => {
      // console.log('Click To Edit', e, item);
      data.currentItem = item;
      tips.type = 'loading';
      tips.show = true;
      tips.msg = '加载中';
      api.getAddressDetail(data.currentItem).then(res => {
        // console.log(res);
        tips.show = false;
        const { code } = res;
        if (code == 0) {
          utils.router.goPage('/settings/pages/address/edit', { data: res.data });
        }

      });



    }
    const delClick = (e, item) => {
      // console.log('Click To Delete', e, item);
      pop.delPop = true;
      data.currentItem = item;
    }
    const addAddress = (e) => {
      // console.log('Click To Add', e);
      utils.router.goPage('/settings/pages/address/add', { data: { isFrist: state.list.length == 0 } });
    }

    onMounted(() => {
      //   reload();
    });

    const delPost = async () => {
      const res = await api.delAddress(data.currentItem);
      if (res['code'] == 0) {
        tips.msg = '删除成功';
        tips.type = 'success';
        tips.show = true;
        setTimeout(() => {
          reload();
        }, 500);
      }
    }

    return {
      ...toRefs(state),
      ...toRefs(params),
      ...toRefs(pop),
      ...toRefs(data),
      ...toRefs(tips),
      editClick,
      delClick,
      delPost,
      addAddress,
      reload,
    }
  }
}
</script>

<style lang="scss">
.my-address {
  height: 100%;
}
</style>
