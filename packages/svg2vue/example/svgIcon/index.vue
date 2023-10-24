<template>
  <component
    v-if="$options.components[name]"
    :is="$options.components[name]"
  ></component>
</template>
<script>
import icons from './config.js'
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  components: {
    ...icons,
  },
}
</script>
