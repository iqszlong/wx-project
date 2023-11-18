<template>
  <view class="my-address-add">

    <nut-input label="联系人" v-model="name" placeholder="姓名" />

    <nut-input label="手机号码" v-model="mobile" placeholder="手机号码" type="tel" />

    <nut-input label="地区信息" v-model="area" placeholder="地区信息" readonly @click="areaPop = true" />

    <nut-input label="详细地址" v-model="detail" placeholder="详细地址" />

    <nut-input label="邮政编码" v-model="postalCode" placeholder="邮编" />


    <div class="n-form-item">
      <div class="label">设为默认</div>
      <nut-switch v-model="isDefault" @change="defaultChange" />
    </div>


    <div class="n-bottom-ctrl">
      <div class="item">
        <nut-button block type="primary" :disabled="!canSubmit" @click="save">保存</nut-button>
      </div>
      <nut-button @click="importAddress">导入微信地址</nut-button>
    </div>

    <!-- 地区弹窗 -->
    <nut-address v-model="ids" v-model:visible="areaPop" :province="province" :city="city" :country="country"
      :town="town" @change="onChange" @close="choosePlace" custom-address-title="请选择所在地区"></nut-address>

    <!-- 消息提示 -->
    <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
  </view>
</template>

<script>
import { reactive, toRefs, watch, onMounted, nextTick } from 'vue';
import Taro from '@tarojs/taro';
import { Router } from "tarojs-router-next"; // 路由库
import api from '@/api/index';

export default {
  components: {
  },
  setup() {

    const routerData = Router.getData();

    console.log(routerData);
    // 提示
    const tips = reactive({
      msg: '查找',
      show: false,
      type: 'text',
      cover: false,
    });


    const state = reactive({
      canSubmit: false,
    });

    const pop = reactive({
      areaPop: false,
    });

    const areaParmas = reactive({
      all: 'false',
      pid: null,
    })

    // 临时数据
    const data = reactive({
      isDefault: routerData.default,
      area: `${routerData.provinceName}${routerData.cityName}${routerData.countyName}${routerData.streetName}`,
      ids: [],
    })

    // 提交接口数据
    const form = reactive({
      id: routerData.id,
      default: routerData.default,
      mobile: routerData.mobile,
      name: routerData.name,
      detail: routerData.detail,
      provinceName: routerData.provinceName,
      cityName: routerData.cityName,
      countyName: routerData.countyName,
      streetName: routerData.streetName,
      postalCode: routerData.postalCode, //邮编
    });

    // 选择数据
    const addressData = reactive({
      province: [
        { id: 1, name: '北京' },
        { id: 2, name: '广西' },
        { id: 3, name: '江西' },
        { id: 4, name: '四川' }
      ],
      city: [
        { id: 7, name: '朝阳区' },
        { id: 8, name: '崇文区' },
        { id: 9, name: '昌平区' },
        { id: 6, name: '石景山区' }
      ],
      country: [
        { id: 3, name: '八里庄街道' },
        { id: 9, name: '北苑' },
        { id: 4, name: '常营乡' }
      ],
      town: []
    });

    // 地理位置选择
    const onChange = ({ custom, next, value }) => {
      // console.log(custom, next, value);
      areaParmas.pid = value.id;
      getArea(next);
    }

    // 关闭地区选择
    const choosePlace = (value) => {
      // console.log(value);
      const { addressIdStr, addressStr, province, country, city, town } = value.data;
      data.ids = addressIdStr.split('_');
      data.area = addressStr;
      form.provinceName = province.name;
      form.cityName = city.name;
      form.countyName = country.name;
      form.streetName = town.name;
    }

    // 导入微信收获地址
    const importAddress = () => {
      Taro.chooseAddress({
        success: function (res) {
          console.log(res);
          const { provinceName, cityName, countyName, detailInfo, telNumber, userName, postalCode } = res;
          data.area = `${provinceName}${cityName}${countyName}`;
          form.mobile = telNumber;
          form.detail = detailInfo;
          form.name = userName;
          form.provinceName = provinceName;
          form.cityName = cityName;
          form.countyName = countyName;
          form.streetName = '';
          form.postalCode = postalCode;
        }
      });
    }

    // 设为默认切换
    const defaultChange = (value) => {
      form.default = value;
    }

    // 保存
    const save = async () => {
      const res = await api.editAddress({ ...form });
      // console.log(res);
      if (res['code'] == 0) {
        tips.msg = '保存成功';
        tips.type = 'success';
        tips.show = true;
        setTimeout(() => {
          Router.back(true);
        }, 500)

      }
    }

    // 监听
    watch(
      () => form,
      (form) => {
        const values = [];
        for (const key in form) {
          if (Object.hasOwnProperty.call(form, key)) {
            if (key != 'default' && key != 'streetName') {// 排除设为默认
              values.push(form[key]);
            }
          }
        }
        // console.log(values);
        if (values.every(el => Boolean(el))) {
          state.canSubmit = true;
        } else {
          state.canSubmit = false;
        }
      }, { deep: true }
    );

    const getArea = async (name = 'province') => {
      const res = await api.getArea(areaParmas);
      const { code, data } = res;
      if (code == 0) {
        addressData[name] = data;

        if (addressData[name].length < 1) {
          pop.areaPop = false;
        }

      }
    }

    onMounted(() => {
      getArea();
    })

    return {
      ...toRefs(state),
      ...toRefs(pop),
      ...toRefs(addressData),
      ...toRefs(form),
      ...toRefs(data),
      ...toRefs(tips),
      ...toRefs(areaParmas),
      onChange,
      choosePlace,
      importAddress,
      defaultChange,
      save,
    }
  }
}
</script>

<style lang="scss">

</style>
