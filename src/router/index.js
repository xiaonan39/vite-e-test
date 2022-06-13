import { createRouter, createWebHashHistory } from 'vue-router'

export const routes = [
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
      title: '项目',
      noCache: false
    },
    children: [
      {
        path: 'imageList',
        component: () => import('../views/project/imageList'),
        name: 'imageList',
        meta: {
          isMenuElement: true,
          title: '图像列表',
          noCache: false
        },
      },
      {
        path: 'chartList',
        component: () => import('../views/project/chartList'),
        name: 'chartList',
        meta: {
          isMenuElement: true,
          title: '图表列表',
          noCache: false
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
      title: '设置',
      noCache: false
    },
    children: [
      {
        path: 'AIEngine',
        component: () => import('../views/setting/AIEngine'),
        name: 'AIEngine',
        meta: {
          isMenuElement: true,
          title: 'AI引擎列表',
          noCache: false
        },
      },
      {
        path: 'roleList',
        component: () => import('../views/setting/roleList'),
        name: 'roleList',
        meta: {
          isMenuElement: true,
          title: '角色列表',
          noCache: true
        },
      }
    ]
  },
  {
    path: '/viewer',
    name: 'viewer',
    component: () => import('../views/viewer/index'),
    meta: {
      noCache: false,
      title: '标注页面'
    }
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