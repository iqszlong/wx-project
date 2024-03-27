<template>
  <view class="map-layout">
    <TopBar class="top-bar-bg" title="地图预览" :setPlace="true"></TopBar>
    <view class="container">
      <map
        id="Map"
        class="map"
        :longitude="location.longitude"
        :latitude="location.latitude"
        :markers="markers"
        :maxScale="18"
        :enablePoi="false"
        :enableBuilding="false"
        :polyline="polyline"
        :scale="scale"
      >
      </map>
      <!-- 按钮组 -->
      <view class="btn-groups">
        <button type="default" size="mini" @tap="handleMoveAlong">
          开始导航
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import { ref, reactive, toRefs, onMounted, onBeforeUnmount } from "vue";
import utils from "@/utils/index";

export default {
  setup() {
    const mapInfos = reactive({
      scale: 17,
      location: {
        latitude: 22.609848,
        longitude: 114.13593,
      },
      markers: [
        {
          id: 1,
          latitude: 40.040129,
          longitude: 116.274968,
          width: 16,
          height: 20,
          iconPath:
            "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
          anchor: {
            x: 0.5,
            y: 0.5,
          },
        },
        {
          latitude: 22.610850418936703,
          longitude: 114.13724935969424,
          id: "08EA23F3-E979-4EC4-AF3C-8F37F58C1900",
          callout: {
            content: "育有学院",
            display: "ALWAYS",
            bgColor: "#ffffff",
            borderWidth: 2,
            borderColor: "#4DC463",
            borderRadius: 20,
            padding: 6,
          },
        },
        {
          latitude: 22.610203786475825,
          longitude: 114.137561182269,
          id: "D4E790AF-65B1-46C5-945A-2BD10F8600B1",
        },
        {
          latitude: 22.609940960806483,
          longitude: 114.13700984381649,
          id: "AFE45AEA-9809-49C1-B016-334218670C65",
        },
        {
          latitude: 22.609911757926877,
          longitude: 114.13679744299316,
          id: "8DE5ECB5-3124-483B-B6D9-B85D257AE51F",
        },
        {
          latitude: 22.60962390057311,
          longitude: 114.13577159201805,
          id: "C33AAE6F-69F4-4CDB-8BA0-0E17C6CF7509",
        },
        {
          latitude: 22.609323527049767,
          longitude: 114.13511631264976,
          id: "757D72F6-2B58-4959-B300-7D58D908437B",
        },
        {
          latitude: 22.608973090512688,
          longitude: 114.13519313854545,
          id: "35095407-1CE1-4F52-85E3-D3D0D0AF943D",
        },
        {
          latitude: 22.60920671496991,
          longitude: 114.13623706623355,
          id: "43E21F04-8641-48F9-ABDF-ED457A2B6AE0",
        },
        {
          latitude: 22.609377761261957,
          longitude: 114.13688330714831,
          id: "978F612B-68DE-4FDC-88A9-0FE27CC3EC5D",
        },
        {
          latitude: 22.608973090512688,
          longitude: 114.13698724809865,
          id: "83AC5400-7F44-4548-8AA3-C816437AF110",
        },
      ],
      polyline: [
        {
          points: [
            { latitude: 22.61081704439181, longitude: 114.1371499381496 },
            { latitude: 22.610508329897364, longitude: 114.13742560727246 },
            { latitude: 22.61024133296585, longitude: 114.13765608482186 },
            { latitude: 22.61018292731601, longitude: 114.13770127639532 },
            { latitude: 22.61011617797681, longitude: 114.13757022066648 },
            { latitude: 22.610053600437123, longitude: 114.13738493489768 },
            { latitude: 22.609932617115852, longitude: 114.13740753061552 },
            { latitude: 22.609861695828577, longitude: 114.13699176715943 },
            { latitude: 22.609840836628837, longitude: 114.13679744299316 },
            { latitude: 22.6098241492031, longitude: 114.13662571464806 },
            { latitude: 22.609607213216567, longitude: 114.13584389864616 },
            { latitude: 22.609736540487223, longitude: 114.13578063027762 },
            { latitude: 22.609348558310547, longitude: 114.13517958101829 },
            { latitude: 22.60936524573029, longitude: 114.1351027553984 },
            { latitude: 22.60938193295698, longitude: 114.13473670257667 },
            { latitude: 22.609219230579676, longitude: 114.13442939913159 },
            { latitude: 22.609131621414896, longitude: 114.13436613090107 },
            { latitude: 22.608902168794483, longitude: 114.13449266736211 },
            { latitude: 22.608856278198996, longitude: 114.13456045499834 },
            { latitude: 22.609023153029867, longitude: 114.13517958101829 },
            { latitude: 22.609031496696044, longitude: 114.13525640684497 },
            { latitude: 22.60891051259536, longitude: 114.13529707942678 },
            { latitude: 22.608973090512688, longitude: 114.13560890200165 },
            { latitude: 22.609089902790895, longitude: 114.13602918450124 },
            { latitude: 22.609148308988324, longitude: 114.13629129624553 },
            { latitude: 22.609281808483946, longitude: 114.13678388550034 },
            { latitude: 22.609319355289276, longitude: 114.13691946053132 },
            { latitude: 22.609319355289276, longitude: 114.13699628635811 },
            { latitude: 22.609177511854853, longitude: 114.13702340141265 },
            { latitude: 22.609131621414896, longitude: 114.13683811550595 },
            { latitude: 22.60891468443192, longitude: 114.13690590300416 },
            { latitude: 22.60891468443192, longitude: 114.13690590300416 },
          ],
          color: "#3875FF",
          width: 3,
        },
      ],
    });
    const mapCtx = Taro.createMapContext("Map");

    // 限制地图的显示范围
    mapCtx.setBoundary({
      southwest: {
        latitude: 22.60627314327096,
        longitude: 114.1339186968504,
      },
      northeast: {
        latitude: 22.613422763841363,
        longitude: 114.13794130314966,
      },
      success: (res) => {
        console.log("success", res);
      },
      fail: (res) => {
        console.log("fail", res);
      },
    });

    /** ============== 基础事件 =============== */
    // 创建自定义图片图层
    const addGroundOverlay = async () => {
      await mapCtx.addGroundOverlay({
        id: 1,
        src: "https://lazy-1319307305.cos.ap-guangzhou.myqcloud.com/df-map-bg.jpg",
        bounds: {
          southwest: {
            latitude: 22.60627314327096,
            longitude: 114.1339186968504,
          },
          northeast: {
            latitude: 22.613422763841363,
            longitude: 114.13794130314966,
          },
        },
        zIndex: 9999999,
        success: (res) => {
          console.log("success", res);
        },
        fail: (res) => {
          console.log("fail", res);
        },
      });
    };
    // 个性化图层
    // const addCustomLayer = async () => {
    //   await mapCtx.addCustomLayer({
    //     layerId: "654baf075426",
    //     success: (res) => {
    //       console.log("success", res);
    //     },
    //     fail: (res) => {
    //       console.log("fail", res);
    //     },
    //   });
    // };
    // 开始轨迹回放
    const handleMoveAlong = () => {
      mapCtx.moveAlong({
        markerId: 1,
        path: mapInfos.polyline[0].points,
        duration: 30000,
        autoRotate: true,
        fail: (err) => {
          console.error(err);
        },
        success: (res) => {
          console.log(res);
        },
      });
    };

    /** ============== 导航事件 =============== */

    onMounted(() => {
      addGroundOverlay();
    });
    return {
      ...toRefs(mapInfos),
      handleMoveAlong,
    };
  },
};
</script>

<style lang="scss">
.map-layout {
  height: 100%;
}

.container {
  position: relative;
  width: 100vw;
  height: calc(100vh - 56px - env(safe-area-inset-bottom));
  overflow: hidden;
}
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
.btn-groups {
  position: absolute;
  top: 15px;
  right: 40px;
  z-index: 2;
}
</style>
