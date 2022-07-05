<template>
  <div class="app-contain">
    <router-view v-slot="{ Component }">
      <keep-alive exclude="ComicMain">
        <component :is="Component" v-bind="$attrs" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'

function provideModule() {
  const isDev = import.meta.env.MODE === 'development'
  provide('isDev', isDev)
  return {
    isDev
  }
}

export default defineComponent({
  name: 'App',
  setup() {
    return {
      ...provideModule()
    }
  }
})
</script>
<style lang="less">
@import '~styles/common';
@import '~styles/app';
@import '~styles/var';
.app-contain {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
