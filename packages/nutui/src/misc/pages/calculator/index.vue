<template>
    <div>
        

        <nut-input type="digit" v-model="num1" placeholder="请输入数字" />


        <nut-input type="digit" v-model="num2" placeholder="请输入数字" />

        <nut-space fill justify="center" style="margin: 10px 0">
            <nut-button block @click="show = true">{{ current.name }}</nut-button>
            <nut-button type="primary" block @click="getResult">计算结果</nut-button>
        </nut-space>

        <div style="font-size: 24px; text-align: center; color:red">{{ result || '' }}</div>

        <nut-action-sheet v-model:visible="show" :menu-items="methodList" @choose="choose" />
    </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, onBeforeUnmount } from "vue";
import utils from "@/utils/index";
const num1 = ref(null);
const num2 = ref(null);
const result = ref(null);
const show = ref(false);

const { calculate } = utils



// 方法
const methodList = [{
    name: '加',
    method: 'highPrecisionAdd'
}, {
    name: '减',
    method: 'highPrecisionReduce'
}, {
    name: '乘',
    method: 'highPrecisionMul'
}, {
    name: '除',
    method: 'highPrecisionDiv'
}];
const current = ref(methodList[0]);

const choose = (item) => {
    current.value = item;
};

const getResult = () => {

    const data1 = num1.value;
    const data2 = num2.value;
    console.log('计算中', data1, data2);
    if (!data1 || !data2) return;

    result.value = calculate[current.value.method](data1, data2);
}
</script>

<style lang="scss"></style>