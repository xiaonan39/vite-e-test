<template>
  <div class="tags-view tags-view-wrapper">
    <router-link
      v-for="tag in visitedViews"
      :key="tag.path"
      :data-path="tag.path"
      :to="{path: tag.path, query: tag.query, fullPath: tag.fullPath}"
      :class="isActive(tag) ? 'active' : ''"
      class="tags-view-item"
      :style="activeStyle(tag)"
    >
      {{ tag.title }}
    </router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import useTagsViewStore from '@/store/module/tagsView'

const route = useRoute()
const affixTags = ref([])

const routes = computed(() => useTagsViewStore().routes)
const visitedViews = computed(() => {
  return useTagsViewStore().visitedViews
})

watch(route, () => {
  addTags()
  moveToCurrentTag()
})

onMounted(() => {
  initTags()
  addTags()
})

const addTags = () => {
  const { name } = route
  console.log(name)
  if (name) {
    useTagsViewStore().addView(route)
  }
  return false
}
const moveToCurrentTag = () => {
  nextTick(() => {
    for(const r of visitedViews.value) {
      if (r.path === route.path) {
        if (r.fullPath !== route.fullPath) {
          useTagsViewStore().updateVisitedView(route)
        }
      }
    }
  })
}
const initTags = () => {
  const res = filterAffixTags(routes.value)
  // 原版打印的res也是[]
  affixTags.value = res
  for(const tag of res) {
    if (tag.name) {
      useTagsViewStore().addVisitedView(tag)
    }
  }
}

/* 应该是筛选不固定的？ */
const filterAffixTags = (routes, basePath = '') => {
  let tags = []
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = getNormalPath(basePath + '/' + route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: { ...route.meta }
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags
}

const isActive = (r) => {
  return r.path === route.path
}
const activeStyle = (tag) => {
  if (!isActive(tag)) return {}
  // 颜色到时可以修改为主题
  return {
    "background-color": '#409EFF',
    "border-color": '#409EFF'
  }
}



console.log(visitedViews)



</script>

<style lang="scss" scoped>
.tags-view {
  height: 40px;
  box-shadow: 0 2px 3px rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 10%);;
  line-height: 40px;
  a {
    text-decoration: none;
  }
  
  .router-link-active {
    text-decoration: none;
  }
}
.tags-view-wrapper {
  .tags-view-item {
    display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
  }
}
</style>