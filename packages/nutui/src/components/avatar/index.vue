<template>
    <div>
        <nut-avatar v-if="isUpdate" size="large" :icon="user.avatarUrl">
        </nut-avatar>
        <nut-avatar v-else size="large" :icon="user.avatarUrl">
        </nut-avatar>
    </div>
</template>

<script>
import { reactive, toRefs, computed } from 'vue'
import { useSystemStore } from '@/store/index';
export default {
    setup() {
        const store = useSystemStore();
        const state = reactive({
            isUpdate: false,
            user: computed(() => store.user),// 用户数据
        })

        const update = () => {
            state.isUpdate = true;
            setTimeout(() => {
                state.isUpdate = false;
            }, 100);

        }

        return {
            ...toRefs(state),
            update,
        }
    }
}
</script>

<style lang="scss" scoped>

</style>