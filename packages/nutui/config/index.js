// const path = require("path");

import ComponentsPlugin from "unplugin-vue-components/webpack";
import NutUIResolver from "@nutui/auto-import-resolver";

import path from "path";

const config = {
  projectName: "nutui",
  date: "2022-9-14",
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: "src",
  outputRoot: `dist/${process.env.TARO_ENV}`, // 根据平台生成代码包
  plugins: [
    "@tarojs/plugin-html",
    [
      "tarojs-router-next-plugin",
      {
        watch: false,
        packages: [
          {
            name: "system",
            pagePath: path.resolve(__dirname, "..", "src/system/pages"),
          },
          {
            name: "shop",
            pagePath: path.resolve(__dirname, "..", "src/shop/pages"),
          },
          {
            name: "settings",
            pagePath: path.resolve(__dirname, "..", "src/settings/pages"),
          },
        ],
      },
    ],
    "taro-plugin-pinia",
  ],
  // 插件包
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "vue3",
  compiler: {
    type: "webpack5",
    // 仅 webpack5 支持依赖预编译配置
    prebundle: {
      enable: false,
      exclude: ['tarojs-router-next'],
    },
  },
  // 别名 同步修改 jsconfig.json
  alias: {
    "@/api": path.resolve(__dirname, "..", "src/api"),
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/assets": path.resolve(__dirname, "..", "src/assets"),
    "@/utils": path.resolve(__dirname, "..", "src/utils"),
    "@/store": path.resolve(__dirname, "..", "src/store"),
    "@/package": path.resolve(__dirname, "..", "package.json"),
    "@/project": path.resolve(__dirname, "..", "project.config.json"),
  },
  cache: {
    enable: true, // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },

  sass: {
    // 自定义主题变量样式文件。在线主题生成器 https://nutui.jd.com/theme/#/base
    resource: [
      // path.resolve(__dirname, '..', 'src/assets/styles/custom_theme.scss')
    ],
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`,
  },

  mini: {
    optimizeMainPackage: {
      enable: true,
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ["nut-"],
        },
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require("terser-webpack-plugin"),
            args: [
              {
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  // mangle: false,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true, // 不改变函数名称
                },
              },
            ],
          },
        },
      });
      // Nutui 样式按需引入
      chain.plugin("unplugin-vue-components").use(
        ComponentsPlugin({
          resolvers: [NutUIResolver({ taro: true })],
        })
      );
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["nutui-taro"],
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    // Nutui 样式按需引入
    webpackChain(chain) {
      chain.plugin("unplugin-vue-components").use(
        ComponentsPlugin({
          resolvers: [NutUIResolver({ taro: true })],
        })
      );
    },
  },
};

module.exports = function (merge) {
  console.log("====================================");
  console.log(process.env.NODE_ENV);
  console.log("====================================");
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
