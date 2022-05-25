<template>
  <div>
    <!-- <el-breadcrumb :separator="separator" class="breadcrumb">
      <el-breadcrumb-item
        :to="item"
        v-for="(item, index) in breadcrumbList"
        :key="index"
        >{{ item.showName }}</el-breadcrumb-item
      >
    </el-breadcrumb> -->

    {{ $router.options.routes }}
    <el-breadcrumb :separator="separator" class="breadcrumb">
      <el-breadcrumb-item
        :to="item.path"
        v-for="(item, index) in $router.options.routes"
        :key="index"
        >{{ item.meta ? item.meta.title : ''  }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const prop = defineProps({
  separator: {
    type: String,
    default: '/'
  },
  breadcrumbList: {
    type: Array,
    default: []
  }
})
const router = useRouter()
console.log(router.options.routes)
</script>
<style lang="scss" scoped>
.breadcrumb {
  line-height: 60px;
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;
  color: #333333;
  // background-color: yellowgreen;
  border-bottom: 1px solid #eeeeee;
}
</style>
