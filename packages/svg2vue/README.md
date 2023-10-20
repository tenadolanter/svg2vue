## 介绍

svg2vue, 根据svg生成vue组件，按需引入svg，方便做tree shaking

## 使用

### 1、安装

```text
# 安装依赖
npm install @tenado/svg2vue -D

或

yarn add @tenado/svg2vue -D
```

### 2、初始化

执行如下命令，会在项目目录下生成一个`svg2vue.config.js`文件，里面记录了脚本执行时候需要的配置

```bash
npx svg2vue init
```

### 3、配置 svg2vue.config.js

| 参数        | 说明                                                                   | 默认值     | 是否可选 |
| ----------- | ---------------------------------------------------------------------- | ---------- | -------- |
| inputPath   | svg 文件夹路径                                                         | ~          | 必填     |
| outputPath  | 生成的vue组件存放位置                                                   | ~          | 必填     |

### 4、转换 svg 成vue组件

```bash
npx svg2vue sync
```

### 5、项目中引入组件

```vue
<template>
  <SvgIcon name="text-fill"></SvgIcon>
</template>
<script>
import SvgIcon from './svgIcon/index.vue'
export default {
  components: {
    SvgIcon,
  },
}
```
