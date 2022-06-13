<template>
  <div class="chart-list">
    图表
    <!-- {{ useName }} -->
  </div>
</template>

<script setup>
// import { useName } from '../../utils/name.js'
import { onMounted, getCurrentInstance, ref } from 'vue'
const chart = ref('图表页面')

const { proxy } = getCurrentInstance()

console.log(proxy)

const handle = () => {
  return '我是一个函数'
}

onMounted(() => {
  handle()
})

</script>

<style lang="scss" scoped>
.chart-list {
}

</style>