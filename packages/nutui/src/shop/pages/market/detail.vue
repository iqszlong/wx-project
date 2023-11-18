<template>
  <PageLoading v-if="loading"></PageLoading>

  <view v-else class="market-detail">
    <nut-backtop :bottom="90">
      <template v-slot:content>
        <nut-swiper class="banner" :pagination-visible="true" @click="showPreview = true">
          <nut-swiper-item v-for="(item, index) in banners" :key="index">
            <img class="banner-img" :src="item" alt="" mode="aspectFill" />
          </nut-swiper-item>
        </nut-swiper>


        <nut-imagepreview v-if="imgData.length" :show="showPreview" :images="imgData" @close="showPreview = false"
          closeable autoplay="0" />

        <div class="detail-layout">

          <div class="n-card">
            <div class="price-wrapper">
              <nut-price :price="price" size="large" :thousands="true" />

              <nut-price class="org-price" :price="originalPrice" size="small" :thousands="true" />


            </div>
            <div class="title">{{ name }}</div>
            <div class="desc">
              {{ brief }}
            </div>
            <nut-divider />
            <view class="html-detail" v-html="detail"></view>
          </div>


        </div>
        <!-- detail-layout -->

      </template>
    </nut-backtop>

    <!--  底部按钮 -->
    <div class="n-bottom-ctrl">
      <div class="item">
        <nut-button block type="primary" @click="showSku = true">加入购物车</nut-button>
      </div>
    </div>

    <!-- sku 弹窗 -->
    <!-- @clickBtnOperate="clickBtnOperate" -->
    <nut-sku v-model:visible="showSku" :sku="sku" :goods="goods" @selectSku="selectSku">
      <template #sku-operate>
        <div class="n-bottom-ctrl static">
          <div class="item">
            <nut-button :disabled="goods.skuId == null" block type="primary" @click="clickBtnOperate">确定</nut-button>
          </div>
        </div>
      </template>
      <template #sku-stepper>
        <div class="num-wrapper">
          <div class="label">购买数量</div>
          <div class="n-space"></div>
          <nut-inputnumber v-model="goodItem.quantity" :min="1" @change="changeStepper" />
        </div>
      </template>
    </nut-sku>

    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />

  </view>
</template>

<script>
import { reactive, toRefs, onMounted, nextTick } from 'vue';

import api from '@/api/index';
import { useCartStore } from '@/store/index';
import utils from '@/utils/index';


export default {
  components: {
  },
  setup() {

    // 路由参数
    const routerParams = utils.router.getParams();
    const routerData = utils.router.getData();

    const store = useCartStore();

    // page 状态
    const page = reactive({
      title: '商品详情',
      loading: true,
    });

    // 弹窗
    const pop = reactive({
      showPreview: false,// 大图片预览
      showSku: false, // 显示sku弹窗
    })

    // 消息
    const tips = reactive({
      msg: '',
      type: 'text',
      show: false,
      cover: false,
    })


    // sku参数
    const skuParams = reactive({
      id: '',// 商品id
      specValueIds: [],// 选中的规格参数
    })

    // 数据
    const state = reactive({
      goodItem: {
        quantity: 1,
      },// 商品 
      banners: [],
      imgData: [],
      name: '', // 商品名称
      brief: '', // 描述
      price: 0, // 价格
      originalPrice: 0, // 原价
      sku: [], // sku选项
      specString: [],// 规格文字
      goods: {
        skuId: '', // 商品信息展示区，商品编号
        price: "0", // 商品信息展示区，商品价格
        imagePath: "", // 商品信息展示区，商品图
      },
      detail: `
            <p>
            <img
                src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn01.jpg"
            />
            <br />
            <img
                src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn02.jpg"
            />
            <br />
            </p>
            <p
    >
    <!--디테일 본문--><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;"> 为大家</font></font
    >
    <br /><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;">
        介绍一款质地柔软奢华的单品</font
      ></font
    >
    <br />
    <br /><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;"> ，</font
      ><font style="vertical-align: inherit;"> 时尚的图案</font
      ><font style="vertical-align: inherit;"> 设计配</font
      ><font style="vertical-align: inherit;"> 了一套配色方案。</font
      ><font style="vertical-align: inherit;">
        用腰带系住腰部的喇叭形轮廓增添了</font
      ><font style="vertical-align: inherit;"> 优雅的</font
      ><font style="vertical-align: inherit;"> 女人味，</font
      ><font style="vertical-align: inherit;"> 根据天气</font
      ><font style="vertical-align: inherit;"> 搭配围巾，</font
      ><font style="vertical-align: inherit;"> 完成了时尚的搭配风格。</font
      ><font style="vertical-align: inherit;">
        推荐作为可用于各种搭配的迷人连衣裙</font
      ><font style="vertical-align: inherit;">
        作为约会造型、会议造型、嘉宾造型和郊游造型！</font
      ></font
    >
    <br /><font style="vertical-align: inherit;"></font> <br /><font
      style="vertical-align: inherit;"
    ></font>
    <br /><font style="vertical-align: inherit;"></font>
    <br />
    <br /><font style="vertical-align: inherit;"></font> <br /><font
      style="vertical-align: inherit;"
    ></font>
    <br /><font style="vertical-align: inherit;"></font> <br /><font
      style="vertical-align: inherit;"
    ></font>
    <br />
    <br /><font style="vertical-align: inherit;"></font> <br /><font
      style="vertical-align: inherit;"
    ></font>
    <br /><font style="vertical-align: inherit;"></font> <br /><font
      style="vertical-align: inherit;"
    ></font>
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </p>
</div>
<div
>
  <h5>
    <font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;">面料与设计</font></font
    >
  </h5>

  <p>
    <!--소재 본문--><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;"> 100%涤纶</font></font
    >
    <br />
    <br /><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;"> 手感厚实不透，</font></font
    >
    <br /><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;">
        手感柔软，即使是敏感肌肤的人也能</font
      ></font
    >
    <br /><font style="vertical-align: inherit;"
      ><font style="vertical-align: inherit;"> 穿着舒适~！</font></font
    >
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
  </p>
</div>

<p></p>

<!--모델컷_시작-->
<p>
  <!--모델착용컬러명-->
  <img
    src="https://styleonme0.img15.kr/webdesign/color_name/deepbrown.jpg"
  /><br />

  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn03.jpg"
    onerror="this.style.display='none';"
    <br=""
  />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn04.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn05.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn06.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn07.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn08.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn09.jpg"
    onerror="this.style.display='none';"
  /><br />
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn10.jpg"
    onerror="this.style.display='none';"
  /><br />
</p>

<!--제품컷_시작-->
<p>
  <img
    src="https://styleonme0.img15.kr/webdesign/2022/0906/3551267/dn11.jpg"
    onerror="this.style.display='none';"
  /><br />
</p>
            `, // 商品详情
    });



    const getData = async () => {
      const _detailData = await api.getGoodsDetail({ id: routerParams.id });
      if (_detailData.code != 0) {
        return;
      }
      console.log(_detailData.data);
      const { id, mainPicUrl, picUrls, name, brief, price, originalPrice, detail, skuId, multiSpec } = _detailData.data;
      state.goodItem = _detailData.data;
      state.goodItem.quantity = routerData.quantity == 0 ? 1 : routerData.quantity;
      state.banners = picUrls;
      state.imgData = state.banners.map(el => { return { 'src': el } });
      state.name = name;
      state.brief = brief;
      state.price = price;
      state.originalPrice = originalPrice;
      state.detail = detail == '' ? state.detail : detail;
      // console.log(state.imgData);

      state.goods.skuId = skuId;
      state.goods.price = price;
      state.goods.imagePath = mainPicUrl;


      if (multiSpec == true) {
        skuParams.id = id;
        // 多规格获取规格参数
        api.getGoodSpecs({ id: id }).then(res => {
          const { code, data } = res;
          if (code == 0) {
            // console.log(data);
            // 赋值sku数据
            state.sku = data.map(el => {
              return {
                ...el,
                list: el.values.map(item => { return { ...item, disable: false, active: false, } })
              }
            });

            // console.log(state.sku);
          }
        })
      }

      // console.log(state.goods);
      // 设置详情的图片模式
      page.loading = false;
      setImgMode();
    }

    onMounted(() => {
      getData();
    });

    const setImgMode = () => {
      nextTick(() => {
        document.getElementsByTagName('image').forEach((el, i) => {
          el.setAttribute('mode', 'widthFix');
        });
      });
    }

    // 点击sku弹窗操作
    const clickBtnOperate = (op) => {
      // console.log('点击了操作按钮', op)
      console.log('商品信息', state.goodItem);
      // 添加购物车
      store.addItem(state.goodItem);
      pop.showSku = false;

      tips.msg = '已添加到购物车';
      tips.type = 'success';
      tips.show = true;
    }


    // 选择sku事件
    const selectSku = (ss) => {
      // console.log(ss);
      const { sku, skuIndex, parentSku, parentIndex } = ss;
      state.sku[parentIndex].list.forEach(s => {
        s.active = s.id == sku.id;
      });

      skuParams.specValueIds[parentIndex] = sku.id;

      state.specString[parentIndex] = sku.name;

      if (state.sku.length == skuParams.specValueIds.length) {
        api.getGoodSku(skuParams).then(res => {
          const { code, data } = res;
          if (code == 0) {
            state.goods.skuId = data.id;
            state.goodItem.skuId = data.id;
            state.goodItem.specification = state.specString.join(';');
          }
        })
      }
    }


    // inputNumber 更改
    const changeStepper = (count) => {
      // console.log('购买数量', count);
      state.goodItem.quantity = count;
    };



    return {
      ...toRefs(state),
      ...toRefs(page),
      ...toRefs(pop),
      ...toRefs(skuParams),
      ...toRefs(tips),
      clickBtnOperate,
      selectSku,
      changeStepper,
    }
  }
}
</script>

<style lang="scss">
.market-detail {
  .banner {
    height: 100vw;

    .banner-img {
      width: 100%;
      height: 100%;
    }
  }


  .detail-layout {
    padding: 16px 16px 80px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }


  .price-wrapper {
    display: flex;
    gap: 8px;
    align-items: baseline;

    .org-price {
      position: relative;
      z-index: 1;
      color: $title-color2 !important;

      &::before {
        content: '';
        position: absolute;
        height: 1px;
        left: 0;
        right: 0;
        background: $title-color2;
        top: 45%;
      }
    }
  }



  .html-detail {
    img {
      display: block;
      width: 100%;
    }
  }

  .num-wrapper {
    display: flex;
  }
}
</style>
