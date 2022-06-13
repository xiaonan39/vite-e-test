<template>
  <div class="common-layout">
    <nav-header />
    <div class="body-bottom">
      <sidebar />
      <el-main clas="box">
        <tags-view />
        <!-- <router-view /> -->
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="cachedViews">
              <component :is="Component" :key="route.path"/>
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </div>
  </div>

</template>

<script setup>
import navHeader from './header.vue'
import sidebar from './menu.vue'
import breadcrumb from '@/components/breadcrumb/breadcrumb.vue'
import tagsView from '../../components/tagsView'
import useTagsViewStore from '@/store/module/tagsView'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const tagsViewStore = useTagsViewStore()
tagsViewStore.addCachedView(route)
const cachedViews = computed(() => {
  return useTagsViewStore.cachedViews
})
// console.log(cachedViews)



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
      height: calc(100vh - 60px);
      // margin: 20px;
      background: var(--theme-white);
      border-radius: 5px;
      padding: unset;
      >div:nth-child(2) {
        height: calc(100vh - 100px);
      }
    }
  }
}


</style>