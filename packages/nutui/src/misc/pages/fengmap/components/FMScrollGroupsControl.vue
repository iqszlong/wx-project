<template>
  <view class="fm-control-groups">
    <cover-view
      class="fm-control-groups-layer fm-btn-layer"
      style="padding: 20rpx; cursor: pointer"
      @tap="switchLayers"
    >
      <cover-image
        v-if="!allLayer"
        src="../images/layer.png"
        style="width: 44rpx; height: 44rpx"
      ></cover-image>
      <cover-image
        v-else
        src="../images/layers.png"
        style="width: 44rpx; height: 44rpx"
      ></cover-image>
    </cover-view>
    <cover-view
      v-if="needArrow"
      @tap="goTop"
      class="scroll"
      style="height: 18px; cursor: pointer"
    >
      <cover-image
        v-if="!isTop"
        src="../images/arrow1.png"
        style="width: 20rpx; height: 12rpx; margin-left: 32rpx"
      ></cover-image>
      <cover-image
        v-else
        src="../images/arrow3.png"
        style="width: 20rpx; height: 12rpx; margin-left: 32rpx"
      ></cover-image>
    </cover-view>
    <scroll-view
      class="fm-layer-list"
      scroll-y="true"
      :style="{ overflow: `hidden`, height: `${scrollHeight}rpx` }"
      :scroll-into-view="`gid_${focusGroupID}`"
      scroll-with-animation="true"
    >
      <view v-for="(item, index) in groupIDs" :key="index">
        <view
          :id="`gid_${item.gid}`"
          style="
            display: inline-block;
            text-align: center;
            width: 84rpx;
            height: 84rpx;
            line-height: 84rpx;
            margin: 0px;
            cursor: pointer;
            font-size: 0.8em;
            font-weight: bold;
            color: rgb(102, 102, 102);
          "
          @tap="switchGroup(item.gid)"
        >
          <view
            :style="{
              color: `${focusGroupID == item.gid ? 'rgb(30, 130, 250)':'rgb(102, 102, 102)'}`, textTransform: 'uppercase',
            }"
          >
            {{ item.gname }}
          </view>
        </view>
        <view
          v-if="item.gid !== 1"
          style="
            height: 1px;
            border-top: 1px solid rgba(153, 153, 153, 0.45);
            border-right: none;
            border-bottom: none;
            border-left: none;
            border-image: initial;
            width: 60%;
            margin: 0px 20%;
          "
        ></view>
      </view>
    </scroll-view>
    <cover-view
      v-if="needArrow"
      class="scroll"
      style="height: 18px; cursor: pointer"
    >
      <cover-image
        v-if="!isBottom"
        @tap="goBottom"
        src="../images/arrow2.png"
        style="width: 20rpx; height: 12rpx; margin-left: 32rpx"
      ></cover-image>
      <cover-image
        v-else
        src="../images/arrow4.png"
        style="width: 20rpx; height: 12rpx; margin-left: 32rpx"
      ></cover-image>
    </cover-view>
  </view>
</template>

<script>
import { reactive, toRefs, watch, computed } from "vue";

export default {
  props: {
    //楼层数组
    groupIDs: {
      type: Array,
      default: null,
    },
    //视野内显示多少个按钮，可手触上下滚动
    showBtnCount: {
      type: Number,
      default: 0,
    },
    //当前的聚焦楼层id
    focusGroupID: {
      type: Number,
      default: 1,
    },
    allLayer: {
      type: Boolean,
    },
  },
  emits: ["switchLayers", "switchGroup"],
  setup(props, { emit }) {
    const { groupIDs, showBtnCount, focusGroupID, allLayer } = props;
    const control = reactive({
      groupIDs: computed(() => props.groupIDs),
      focusGroupID: computed(() => props.focusGroupID),
      scrollHeight: 180,
      isTop: false,
      isBottom: true,
      needArrow: false,
    });
    /** ============== 基础事件 =============== */
    /**
     * 切换聚焦楼层
     * @param {*} e
     */
    const switchGroup = (gid) => {
      let focusId = gid;
      emit("switchGroup", focusId);

      _setArrowBtnStatus(focusId);
    };

    /**
     * 设置上下箭头按钮的状态
     * @param {*} focusId 聚焦楼层id
     */
    const _setArrowBtnStatus = (focusId) => {
      if (focusId === 1) {
        control.isBottom = true;
      } else if (focusId === groupIDs.length - 1) {
        control.isTop = true;
      } else {
        control.isTop = false;
        control.isBottom = false;
      }
    };

    /**
     * 切换单层多层
     */
    const switchLayers = () => {
      emit("switchLayers", focusGroupID);
    };

    /**
     * 向上切换楼层
     */
    const goTop = () => {
      let gid = focusGroupID + 1;
      emit("switchGroup", gid);
      _setArrowBtnStatus(gid);
    };

    /**
     * 向下切换楼层
     */
    const goBottom = () => {
      let gid = focusGroupID - 1;
      emit("switchGroup", gid);
      _setArrowBtnStatus(gid);
    };

    watch(
      () => props.showBtnCount,
      (newValue) => {
        if (newValue < groupIDs.length) {
          control.needArrow = true;
          control.scrollHeight = newValue * 84;
        }
      }
    );

    watch(
      () => props.focusGroupID,
      (newValue) => {
        _setArrowBtnStatus(newValue);
      }
    );

    return {
      ...toRefs(control),
      switchGroup,
      switchLayers,
      goTop,
      goBottom,
    };
  },
};
</script>

<style lang="scss">
.fm-control-groups {
  width: 84rpx;
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.3) 4rpx 4rpx 6rpx;
  border-radius: 4rpx;
  bottom: 400rpx;
  left: 40rpx;
}
</style>
