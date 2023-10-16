# wx-project
 
Taro 小程序项目模板。使用京东Nutui搭建的商城小程序模板。

## 项目目录
`packages/nutui`

可以单独使用，也可以作为项目模板复制使用。

## PNPM工作空间包含组件以及包名
- 组件(/components) 
    - @lazy/components-wx Lazy微信组件包
- 工具js(/utils)
    - @lazy/utils 公共js(/js)
    - @lazy/utils-wx 微信小程序公共js(/wx)

## 安装
```bash
# 安装依赖
pnpm i
# 启动项目
pnpm dev:weapp
pnpm dev:weapp-win #windows
pnpm dev:weapp-mac #Mac

# 打包微信小程序
pnpm build:weapp
```