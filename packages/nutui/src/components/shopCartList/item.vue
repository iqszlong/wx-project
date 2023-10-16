<template>
    <nut-card v-bind="cardData">
        <template #origin>
            <slot name="origin"></slot>
        </template>
        <template #prolist>
            <slot name="prolist">
                <div class="item-desc">{{ item.specification }}</div>
            </slot>
        </template>
        <template #footer>
            <slot name="footer">
                <div class="link" @click="linkClick"></div>
                <div class="customize">
                    <addCtrl :item="item" :quantity="item.quantity" :readonly="true" :min="min"></addCtrl>
                </div>
            </slot>
        </template>
    </nut-card>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import utils from '@/utils/';
export default {
    props: {
        data: {
            type: Object,
            default: {}
        },
        imgUrl: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        price: {
            type: String,
            default: ''
        },
        vipPrice: {
            type: String,
            default: ''
        },
        min: {
            type: Number,
            default: 0
        }
    },
    emits: ['linkClick'],
    setup(props,{emit}) {

        // const store = useStore();

        const state = reactive({
            cardData: computed(() => {
                const { imgUrl, title, price, vipPrice } = props;
                return { imgUrl, title, price, vipPrice };
            }),
            item: props.data,
        })

        const linkClick = () => {
            emit('linkClick')
        }

        return {
            ...toRefs(state),
            linkClick,
        }
    }
}
</script>

<style lang="scss">

</style>