<template>
  <component
    class="form-icon"
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
<style scoped>
.form-icon {
  height: 1em;
  width: 1em;
  vertical-align: middle;
  color: inherit;
  fill: currentColor;
  user-select: none;
}
</style>
