<template>
    <view class="address-wrapper">
        <div class="address" @click="showPopAddress = true">

            <div v-if="currentAddress == null" class="empty-select">
                <nut-icon name="locationg3"></nut-icon>请选择派送地址
            </div>

            <div v-else class="current-select">
                <nut-icon name="locationg3"></nut-icon>
                <div class="ad-body">
                    <div class="ad-title">
                        {{ currentAddress.name }}
                        {{ currentAddress.mobile }}
                    </div>
                    <div class="ad-detail">
                        {{ currentAddress.fullAddress }}
                    </div>
                </div>
            </div>

        </div>

        <nut-popup pop-class="pop-address" v-model:visible="showPopAddress" :z-index="100" position="bottom" closeable
            round>
            <div class="n-pop-inner">
                <div class="n-pop-header">
                    <div class="n-pop-title">
                        配送至
                    </div>
                </div>
                <div class="n-pop-body">
                    <div :class="['address-item', currentAddress.id == item.id ? 'active' : '']"
                        v-for="item of existAddress" :key="item.id" @click="chooseAddress(item)">
                        <nut-icon name="Check" v-if="currentAddress.id == item.id"></nut-icon>
                        <nut-icon name="locationg3" v-else></nut-icon>
                        <div class="ad-body">
                            <div class="ad-title">
                                {{ item.name }}
                                {{ item.mobile }}
                            </div>
                            <div class="ad-detail">
                                {{ item.fullAddress }}
                            </div>
                        </div>
                    </div>

                    <!-- <img src="https://img.server.com/picture/Beautyleg/05.25%20No.539%20Lynn%2068pics/0007.jpg" style="width:100%" alt=""  mode="widthFix"/> -->
                </div>
                <div class="n-pop-bottom">
                    <nut-button block type="primary" @click="goAdd">添加新地址</nut-button>
                </div>
            </div>
        </nut-popup>

        <!-- <nut-address v-model:visible="showPopAddress" type="exist" :exist-address="existAddress" @close="close"
            :is-show-custom-address="false" exist-address-title="配送至">
            <template #bottom>
                <div class="bottom-btn-wrapper">
                    <nut-button block type="primary" @click="goAdd">添加新地址</nut-button>
                </div>
            </template>
        </nut-address> -->

    </view>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue'
import api from '@/api/index';
import utils from '@/utils/index';

export default {

    setup() {
        const state = reactive({
            existAddress: [], // 已存在地址
            currentAddress: null,
        })
        // 弹窗
        const pop = reactive({
            showPopAddress: false,
        });

        // 关闭弹窗
        // const close = (val) => {
        //     if (val.type == 'exist') {
        //         // const { provinceName, cityName, countyName, townName, addressDetail } = val.data
        //         // state.currentAddress = provinceName + cityName + countyName + townName + addressDetail;
        //         // console.log(val.data);
        //         state.currentAddress = val.data;
        //         // pop.showPopAddress = false;
        //     } else {
        //         console.log(val.data.addressStr);
        //         // text.value = val.data.addressStr;
        //     }
        // };

        // 选择地址
        const chooseAddress = (item) => {
            state.currentAddress = item;
            pop.showPopAddress = false;
        }

        // 验证是否有选择地址
        const checkAddress = () => {
            if (state.currentAddress == null) {
                return false;
            } else {
                return true;
            }
        }

        const getData = async () => {
            await getDefaultAddress();
        }

        // 获取所有地址
        const getDefaultAddress = async () => {
            const res = await api.getAddress({ pageNo: 1, pageSize: 100, default: false });
            // console.log(res);
            if (res.data != null) {
                state.existAddress = res.data.list;
                const defaultList = res.data.list.filter(el => el.default == true);
                state.currentAddress = defaultList[0];
            }
        }

        // 添加地址
        const goAdd = async () => {

            const hasData = await utils.router.goPage('/pages/address/add', { data: { isFrist: state.existAddress.length == 0 } });
            if (hasData) {// 如果确定保存过数据则刷新列表
                // console.log('hasData');
                state.existAddress = [];
                getData();
            }
        }

        // 返回地址
        const returnData = () => {
            return state.currentAddress;
        }

        onMounted(() => {
            getData();
            // state.existAddress = [{
            //     id: 1,
            //     addressDetail: '',
            //     cityName: '次渠镇',
            //     countyName: '通州区',
            //     provinceName: '北京市',
            //     selectedAddress: false,
            //     townName: '',
            //     name: '探探鱼',
            //     phone: '182****1718'
            // },
            // {
            //     id: 2,
            //     addressDetail: '',
            //     cityName: '钓鱼岛全区',
            //     countyName: '',
            //     provinceName: '钓鱼岛',
            //     selectedAddress: false,
            //     townName: '',
            //     name: '探探鱼',
            //     phone: '182****1718'
            // },
            // {
            //     id: 3,
            //     addressDetail: '京东大厦',
            //     cityName: '大兴区',
            //     countyName: '科创十一街18号院',
            //     provinceName: '北京市',
            //     selectedAddress: false,
            //     townName: '',
            //     name: '探探鱼',
            //     phone: '182****1718'
            // }]
        });

        return {
            ...toRefs(state),
            ...toRefs(pop),
            // close,
            chooseAddress,
            checkAddress,
            getData,
            goAdd,
            returnData,
        }
    }
}
</script>

<style lang="scss">
// .address-wrapper{
//     overflow: hidden;
// }
.address {
    background: $white;
    padding: 8px 16px;
    border-bottom: 2px solid $primary-color;
    // margin: 12px 0;
    box-shadow: 0 0 15px rgba(0, 0, 0, .1);

    .empty-select {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .current-select {
        display: flex;
        align-items: center;
        gap: 8px;

        .nut-icon {
            color: $primary-color;
        }

        .ad-title {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: bold;
        }

        .ad-detail {
            font-size: 12px;
        }
    }
}

.pop-address {
    .n-pop-body {
        min-height: 40vh;
        max-height: 60vh;
    }

    .ad-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: bold;
    }

    .ad-detail {
        font-size: 12px;
    }

}

.address-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;

    +.address-item {
        border-top: 1px solid #E7E7E7;
    }

    &.active {
        .nut-icon {
            color: $primary-color;
        }
    }

}

// .bottom-btn-wrapper {
//     padding: 16px;
// }
</style>