<template>
  <view class="map-layout">
    <TopBar class="top-bar-bg" title="地图预览" :setPlace="true"></TopBar>
    <view class="container">
      <!-- 绘制3D地图所用的canvas -->
      <canvas
        type="webgl"
        id="ooomap"
        style="width: 100%; height: 100%; z-index: 0"
        disable-scroll
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      >
      </canvas>
      <!-- 创建2d平面图像画布 -->
      <canvas
        type="2d"
        id="temp"
        style="
          pointer-events: none;
          position: absolute;
          left: -1000px;
          z-index: 0;
        "
      ></canvas>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import { ref, reactive, toRefs, onMounted, onBeforeUnmount } from "vue";
import utils from "@/utils/index";
const om = require("./ooomap.xcx.min.js");

export default {
  setup() {
    const mapInfos = reactive({
      mapLoaded: false, //地图是否加载完成
      focusGroupID: 1,
      mapGroupIDs: [],
      isAllLayer: false,
    });
    let fmap = null; // map对象
    let canvas = null; // 地图容器3D
    let tmpCanvas = null; // 地图容器2D
    let building = null; // 建筑对象
    let startMarker = null; // 开始点marker
    let endMarker = null; // 结束点marker

    // 模拟导肮相关参数
    const simulateOptions = reactive({
      // 路线的起点
      startPoint: { x: 111.06085170368081, y: 42.4487379063097, z: 0 },
      // 路线的终点
      endPoint: { x: -60.15972549220356, y: 13.400388279865552, z: 0 },
      routeResult: null,
      car: null,
      car_len: 0,
      woman: null,
      woman_len: 0,
    });
    /** ============== 基础事件 =============== */
    // 初始化创建地图
    const onCreateMap = () => {
      const mapOptions = {
        // 必要，地图容器
        container: canvas,
        // 必要，2d画布
        canvas2d: tmpCanvas,
        // 在ooomap编辑器中生成，或由官方提供
        verifyUrl:
          "https://www.ooomap.com/ooomap-verify/check/13b7e6de01570b42ae2a686c1253756d",
        appID: "3c4caa9aeb0a89a1c731308956bee252",
        frameRate: 50,
        // false 取消非聚焦楼层的半透明显示
        enableFloorAlpha: false,
        // 事件直接绑定在 canvas 上
        eventsOnContainer: false,
      };

      if (!om) {
        return;
      }
      //初始化地图对象
      fmap = new om.Map(mapOptions);

      // 当建筑对象创建完成时
      fmap.on("buildingLoaded", (b) => {
        console.log("建筑对象加载完成");
        building = b;

        // 创建起终点marker
        startMarker = createMarker(
          "https://www.ooomap.com/assets/map_images/start2.png"
        );
        endMarker = createMarker(
          "https://www.ooomap.com/assets/map_images/end2.png"
        );

        startMarker.position.copy(simulateOptions.startPoint);
        endMarker.position.copy(simulateOptions.endPoint);

        fmap.view.viewMode = "3d";
        fmap.view.zoomLevel = 18;
      });

      // 当楼层创建完成时
      fmap.on("floorLoaded", (floor) => {
        if (floor.data.floorNumber === -1) {
          floor.markerNode.add(startMarker, endMarker);
          startMarker.show = endMarker.show = true;

          // 绘制路线
          createFindPath();
        }
      });

      // 模型加载完成事件
      fmap.on("modelCreated", (model) => {
        switch (model.name) {
          case "car": // 得到卡车模型对象
            simulateOptions.car = model;
            break;
          case "woman": // 得到人物模型对象
            simulateOptions.woman = model;
            break;
        }
      });

      // 更新地图 - 添加卡车
      fmap.on("update", (delta) => {
        // 如果卡车的模型还没有加载进来, 或路线规划没有完成时
        if (!simulateOptions.car || !simulateOptions.routeResult) return false;

        const lineNode = simulateOptions.routeResult.lines[0];

        // 距离累加, 速度是5的0.5倍
        simulateOptions.car_len += delta * 15;

        if (simulateOptions.car_len > lineNode.length) {
          simulateOptions.car_len = 0;
        }
        // 得到线上某一个给定长度的坐标以及方向
        // res = {point, direction}
        const res = lineNode.getPointByLength(simulateOptions.car_len);

        // 将车的方向与此位置的方向保持一至
        simulateOptions.car.entity.lookAt(res.point.clone().add(res.direction));
        simulateOptions.car.entity.rotateX(-Math.PI / 2);
        simulateOptions.car.entity.rotateZ(Math.PI / 2);

        // 将车移动到这个位置上
        simulateOptions.car.position.copy(res.point);
      });

      // 更新地图 - 添加人员
      fmap.on("update", (delta) => {
        // 如果人物的模型还没有加载进来, 或路线规划没有完成时
        if (!simulateOptions.woman || !simulateOptions.routeResult)
          return false;

        const lineNode = simulateOptions.routeResult.lines[0];

        // 距离累加, 速度是5的0.5倍
        simulateOptions.woman_len += delta * (15 * 0.5);

        if (simulateOptions.woman_len > lineNode.length) {
          simulateOptions.woman_len = 0;
        }
        // 得到线上某一个给定长度的坐标以及方向
        // res = {point, direction}
        const res = lineNode.getPointByLength(simulateOptions.woman_len);

        // 将人的方向与此位置的方向保持一至
        simulateOptions.woman.entity.lookAt(
          res.point.clone().add(res.direction)
        );
        simulateOptions.woman.entity.rotateX(-Math.PI / 2);

        // 将人移动到这个位置上
        simulateOptions.woman.position.copy(res.point);
      });
    };
    // 创建POI标记的方法
    const createMarker = (url) => {
      return new om.SpriteMarkerNode(fmap, {
        type: "poi",
        autoHide: false, // 在遮挡时, 不会自动避让
        priority: 10,
        renderOrder: 3,
        content: {
          image: {
            url: url,
            width: 60,
            height: 60,
          },
        },
      });
    };
    // 创建两点之间的路线
    const createFindPath = () => {
      const from = {
        floorNumber: -1,
        point: simulateOptions.startPoint,
      };

      const to = {
        floorNumber: -1,
        point: simulateOptions.endPoint,
      };

      building.findPath(from, to).then((res) => {
        simulateOptions.routeResult = res;
      });
    };

    /** =================== 系统滑动事件 ====================== */
    // 手指触摸动作开始
    const handleTouchStart = (e) => {
      canvas.dispatchTouchEvent({
        ...e,
        type: "touchstart",
      });
    };
    // 手指触摸后移动
    const handleTouchMove = (e) => {
      canvas.dispatchTouchEvent({
        ...e,
        type: "touchmove",
      });
    };
    // 手指触摸动作结束
    const handleTouchEnd = (e) => {
      canvas.dispatchTouchEvent({
        ...e,
        type: "touchend",
      });
    };

    /** =================== 导航事件 ====================== */

    onMounted(async () => {
      utils.global.getElement("ooomap", (node) => {
        canvas = node;
        utils.global.getElement("temp", (node) => {
          tmpCanvas = node;

          onCreateMap();
        });
      });
    });

    // 在离开页面时销毁地图对象
    onBeforeUnmount(() => {
      if (fmap) {
        fmap.dispose();
      }
    });
    return {
      ...toRefs(mapInfos),
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
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
  height: calc(100vh - 56px - env(safe-area-inset-bottom) - 50px);
  overflow: hidden;
  z-index: 0;
}
.btn-groups {
  position: absolute;
  top: 15px;
  right: 40px;
  z-index: 2;
}
</style>
