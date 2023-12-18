<template>
    <view class="login">
        <div class="need-login">
            <nut-empty image="error" description="查看该页面需要登录权限">
                <div style="margin-top: 10px">
                    <nut-button type="primary" icon="my" @click="login">
                        立即登录
                    </nut-button>
                </div>
            </nut-empty>
            <nut-toast :msg="msg" v-model:visible="show" :type="type" :cover="cover" />
        </div>
    </view>
</template>

<script>
import { reactive, toRefs } from 'vue';
import utils from '@/utils/index';

export default {
    props: {
        path: {
            type: String,
            default: '/pages/index/index',
        },
    },
    setup(props) {

        const state = reactive({

        });
        const tips = reactive({
            msg: '登录',
            show: false,
            type: 'text',
            cover: false,
        });

        const login = () => {
            // 用户登录
            utils.user.userLogin({},()=>{
                utils.router.relaunch(props.path); // 重定位到页面
            });
        }

        return {
            ...toRefs(state),
            ...toRefs(tips),
            login,
        }
    }
}
</script>

<style lang="scss">
.login {
    width: 100vw;
    height: 100vh;
}

.need-login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>