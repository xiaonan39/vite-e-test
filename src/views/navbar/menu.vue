<template>
  <div class="navbar-menu">
    <el-menu
      :default-active="$route.path"
      router>
      <el-sub-menu  v-for="(item, key) in menuList"
      :key="key"
      :index="key+''">
        <template #title>
          <span>{{ item.menuName }}</span>
        </template>
        <el-menu-item-group v-for="(childItem, childKey) in item.children" :key="childKey">
          <el-menu-item :index="childItem.url">
            {{ childItem.menuName }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

const menuList = reactive([
  {
    menuName: '项目',
    path: '/project',
    children: [
      { menuName: '图像列表', url: '/project/imageList'},
      { menuName: '图表列表', url: '/project/chartList'}
    ]
  },
  {
    menuName: '设置',
    path: '/setting',
    children: [
      { menuName: '用户列表', url: '/setting/userList', name: 'user' },
      { menuName: '角色分配', url: '/setting/roleList', name: 'role' }
    ]
  }
])

// const router = useRouter()

</script>

<style scoped lang="scss">
.navbar-menu {
  height: 100%;
  background: var(--theme-white);
  /* display: flex;
  flex-direction: column;
  justify-content: space-between; */
  padding-bottom: 80px;
  :deep(.el-menu) {
    border-right: 0px;
    width: 230px;
  }
}

</style>