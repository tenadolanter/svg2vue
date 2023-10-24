## 介绍

svg2vue, 根据 svg 生成 vue 组件，按需引入 svg，方便做 tree shaking

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

| 参数       | 说明                    | 默认值 | 是否可选 |
| ---------- | ----------------------- | ------ | -------- |
| inputPath  | svg 文件夹路径          | ~      | 必填     |
| outputPath | 生成的 vue 组件存放位置 | ~      | 必填     |
| prefix     | 生成组件名的前缀        | Ticon  | 否       |
| separator     | 组件名的分隔符        | -  | 否       |

### 4、转换 svg 成 vue 组件

```bash
npx svg2vue sync
```

### 5、项目中引入组件

单组件引入：

```vue
<template>
  <TiconAddCopy></TiconAddCopy>
</template>
<script>
import { TiconAddCopy } from './svgIcon/index.js'
export default {
  components: {
    TiconAddCopy,
  },
}
```

动态组件的方式引入：

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
