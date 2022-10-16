
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'index',
        component: () => import(/* webpackChunkName: "IndexPage" */'pages/IndexPage.vue')
      },
      {
        path: 'create',
        name: 'create',
        component: () => import(/* webpackChunkName: "CreatePage" */'pages/CreatePage.vue')
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
