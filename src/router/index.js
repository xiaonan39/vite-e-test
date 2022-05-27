import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../views/HelloWorld.vue'),
    name: 'home',
    meta: {
      noRequireAuth: true,
      title: '首页'
    }
  },
  {
    path: '/project',
    redirect: '/imageList',
    component: () => import('../views/project/index.vue'),
    name: 'project',
    // redirect: '/home',
    meta: {
      noRequireAuth: true,
      title: '项目'
    },
    children: [
      {
        path: 'imageList',
        component: () => import('../views/project/imageList'),
        meta: {
          isMenuElement: true,
          title: '图像列表'
        },
      },
      {
        path: 'chartList',
        component: () => import('../views/project/chartList'),
        meta: {
          isMenuElement: true,
          title: '图表列表'
        },
      }
    ]
  },
  {
    path: '/setting',
    redirect: '/setting/userList',
    component: () => import('../views/setting/index.vue'),
    name: 'setting',
    meta: {
      noRequireAuth: true,
      title: '设置'
    },
    children: [
      {
        path: 'AIEngine',
        component: () => import('../views/setting/AIEngine'),
        meta: {
          isMenuElement: true,
          title: 'AI引擎列表'
        },
      },
      {
        path: 'roleList',
        component: () => import('../views/setting/roleList'),
        meta: {
          isMenuElement: true,
          title: '角色列表'
        },
      }
    ]
  },
  {
    path: '/404', // /:pathMatch(.*)'
    name: 'page-not-found',
    component: () => import('../views/pageNotFound.vue')
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404',
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(),
  routes
})

export default router