<template>
  <div class="category">
    <nut-category :category="category" @change="change">
      <nut-categorypane :categoryChild="categoryChild" @onChange="onChange">
      </nut-categorypane>
    </nut-category>
  </div>
</template>

<script>
import { reactive, toRefs ,onMounted } from 'vue';
import api from "@/api";
import utils from '@/utils/index';
export default {
  components: {
  },
  setup() {
    const state = reactive({
      msg: '分类',
      categoryInfo: {},
      category: [{}],
      categoryChild: [{}]
    });

    const getData = () => {
      api.test().then((res) => {
        console.log(res.data);
          const { categoryInfo, categoryChild } = res.data;
          state.categoryInfo = categoryInfo;
          state.category = categoryInfo.category;
          state.categoryChild = categoryChild;
        })
        .catch((err) => console.log('Oh, error', err)); 
    };


    const change = (index) => {
      state.categoryChild = [].concat(state.categoryInfo['category'][index + 1].children);
    };
    const onChange =(item)=>{
        console.log("当前分类数据",item);
        utils.router.goPage("/pages/market/index")
        
    }

    onMounted(() => {
      setTimeout(() => {
        getData();
      }, 500);
    });

    return {
      ...toRefs(state),
      onChange,
      change,
    }
  }
}
</script>

<style lang="scss">

</style>
