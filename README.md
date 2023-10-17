# wx-project
 
Taro 小程序项目模板。使用京东Nutui搭建的商城小程序模板。
基于Taro的开箱即用微信小程序开发包。

## 使用库
- [Taro](https://taro-docs.jd.com/docs/)
- [Nutui v3](https://nutui.jd.com/3x/#/zh-CN/guide/start)
- [dayjs](https://dayjs.fenxianglu.cn/)
- [pinia](https://pinia.vuejs.org/zh/)
- [taro-axios](https://taro-ext.jd.com/plugin/view/5d40fc9308267b4198ad0c3c)
- [tarojs-router-next](https://taro-ext.jd.com/plugin/view/5f64832f0dd8313026e0942b)
- [vue3-eventbus](https://www.npmjs.com/package/vue3-eventbus)

## 包含功能
- 微信授权登录
- 购物车
- 订单
- 收货地址
- 支付
- 分享
- 修改用户资料
- 路由权限
- 商品分类列表
- 商品详情
- 地图定位
- 微信通知


## 项目目录
- components (组件)
    - @lazy/components-wx (Lazy微信组件包)
- packages (项目文件)
    - nutui (可以作为项目模板复制使用)
- utils (工具js)
    - /js  (公共js) @lazy/utils
    - /wx  (微信小程序公共js) @lazy/utils-wx

## nutui模板目录
- config (配置文件)
- dist (生成文件)

## 安装
进入项目目录`packages/nutui`运行命令
```shell
# 安装依赖
pnpm i
# 启动项目
pnpm dev:weapp-win #windows
pnpm dev:weapp-mac #Mac

# 打包微信小程序
pnpm build:weapp
```

## Taro版本同步
遇到编译打包失败，或者版本升级，可以使用以下命令同步Taro版本。
```shell
# 使用Taro 升级命令更新CLI版本到最新版本
pnpm taro update self
# 使用Taro 升级命令更新CLI版本到指定版本
pnpm taro update self [版本号]
# 使用Taro 升级命令将项目依赖升级到与@tarojs/cli一致的版本
pnpm taro update project
# 使用Taro 升级命令将项目依赖升级到指定版本
pnpm taro update project [版本号]
```



# 问题解决方案收集
+ [app.js错误](https://github.com/NervJS/taro/issues/13456)
