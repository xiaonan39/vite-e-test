<template>
  <div class="common-layout">
    <nav-header />
    <div class="body-bottom">
      <sidebar />
      <el-main>
        <!-- <div class="box" >
          <breadcrumb />
        </div> -->
        <router-view />
      </el-main>
    </div>
  </div>

</template>

<script setup>
import navHeader from './header.vue'
import sidebar from './menu.vue'
import breadcrumb from '@/components/breadcrumb/breadcrumb.vue'



</script>

<style lang="scss" scoped>
.common-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  .body-bottom {
    display: flex;
    // flex: 1;
    :deep(.el-main) {
      height: calc(100vh - 100px);
      margin: 20px;
      background: var(--theme-white);
      border-radius: 5px;
    }
  }
}


</style>