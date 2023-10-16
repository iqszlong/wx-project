<template>
    <nut-card v-bind="item">
        <template #origin>
            <slot name="origin"></slot>
        </template>
        <template #prolist>
            <slot name="prolist">
                <div class="item-desc">{{ item.brief }}</div>
            </slot>
        </template>
        <template #footer>
            <slot name="footer">
                <div class="link" @click="linkClick"></div>

                <specBtn v-if="item.multiSpec" :item="item"></specBtn>
                <addCtrl v-else :quantity="quantity" :item="item" :readonly="true"></addCtrl>

            </slot>
        </template>
    </nut-card>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'

export default {
    props: {
        data: {
            type: Object,
            default: {}
        },
        imgUrl: {
            type: String,
            default: ""
        },
        title: {
            type: String,
            default: ""
        },
        price: {
            type: String,
            default: ""
        },
        vipPrice: {
            type: String,
            default: ""
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    emits: ['linkClick'],
    setup(props, { emit }) {
        // const store = useStore();
        const state = reactive({
            item: computed(() => {
                const { data, imgUrl, title, price, vipPrice } = props;
                return { imgUrl, title, price, vipPrice, ...data };
            }),
            quantity: props.data.quantity ? props.data.quantity : 0,
            readonly: props.readonly,
        });


        const linkClick = () => {
            emit('linkClick')
        }


        return {
            ...toRefs(state),
            linkClick,
        };
    },

}
</script>

<style lang="scss">

</style>