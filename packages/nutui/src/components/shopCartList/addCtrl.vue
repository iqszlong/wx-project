<template>
    <div class="add-btn">
        <nut-inputnumber :model-value="quantity" v-bind="$props" @change="countChange" />
    </div>
</template>

<script>
import { reactive, toRefs} from 'vue'
import { useCartStore } from '@/store/index';

export default {
    props: {
        min: {
            type: Number,
            default: 0,
        },
        quantity: {
            type: Number,
            default: 0,
        },
        readonly: {
            type: Boolean,
            default: false
        },
        item: {
            type: Object,
            default: {}
        }
    },
    setup(props) {

        const store = useCartStore();


        const state = reactive({
            ...props,
        })

        // 触发数量变化
        const countChange = (value) => {
            state.item.quantity = Number(value);
            store.addItem(state.item);
        }


        return {
            ...toRefs(state),
            countChange,
        }
    }
}
</script>

<style lang="scss">
.nut-inputnumber__text--readonly {
    background: #fff;
    width: 20px;
  }
</style>