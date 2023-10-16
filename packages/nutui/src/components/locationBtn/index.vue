<template>
    <nut-button class="location-btn" type="default" size="small" @click="openMap">
        <nut-icon name="locationg3" :size="10"></nut-icon>
        {{msg}}
        <nut-icon name="right" :size="10"></nut-icon>
    </nut-button>
</template>

<script>
import { reactive, toRefs, onMounted } from 'vue';
import Taro from '@tarojs/taro';

export default {
    setup() {
        const tips = reactive({
            msg: '正在获取地理位置',
        });

        const page = reactive({
            loading: true,
        });

        const state = reactive({
            latitude: null, // 纬度，范围为 -90~90，负数表示南纬
            longitude: null, // 经度，范围为 -180~180，负数表示西经
            speed: null, //速度，单位 m/s
            accuracy: null, //位置的精确度
        });

        // 获取位置经纬度
        const getLocation = (type = 'wgs84') => {
            // console.log('type', type);
            Taro.getLocation({
                type: type, // wgs84 返回 gps 坐标，gcj02 返回可用于 Taro.openLocation 的坐标
                altitude: true, // 高精度，获取速度会慢
                success: function (res) {
                    console.log('====================================');
                    console.log(res);
                    console.log('====================================');

                    const { latitude, longitude } = res;
                    state.latitude = latitude;
                    state.longitude = longitude;
                    tips.msg = '大学城店';
                    page.loading = false;
                }
            });
        }

        // 打开当前地理位置
        const openMap = () => {
            if (!page.loading) {
                Taro.openLocation({
                    latitude: state.latitude,
                    longitude: state.longitude,
                    scale: 18
                })
            }
        }


        // 获取微信地理位置授权
        const wxLocation = () => {
            Taro.getSetting({
                success: function (res) {
                    // 精确地理位置授权
                    if (!res.authSetting['scope.userLocation']) {
                        Taro.authorize({
                            scope: 'scope.userLocation',
                            success: function () {
                                getLocation('gcj02');

                            }
                        })
                    } else {
                        getLocation('gcj02');
                    }
                }
            });
        }

        // 刷新
        const reload = () => {
            if (page.loading == true) return; // 避免重复执行
            state.latitude = null;
            state.longitude = null;

            tips.msg = '正在获取地理位置';
            page.loading = true;
            wxLocation();
        }

        onMounted(() => {
            wxLocation();
        })


        return {
            ...toRefs(page),
            ...toRefs(tips),
            ...toRefs(state),
            openMap,
            reload,
        }
    }
}
</script>

<style lang="scss">
.location-btn {
    border: none;
}
</style>