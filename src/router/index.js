import React from "react";

// lazy懒加载组件时要搭配Suspense组件使用（Suspense组件我放在了main.js里）

const routes = [
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('../pages/Discover'))
  },
  {
    path: '/discover',
    exact: true,
    component: React.lazy(() => import('../pages/Discover')),
    routes: [
      {
        path: '/toplist',
        component: React.lazy(() => import('../pages/Toplist'))
      },
      {
        path: '/playlist',
        component: React.lazy(() => import('../pages/Playlist'))
      },
      {
        path: '/djradio',
        component: React.lazy(() => import('../pages/FM'))
      },
      {
        path: '/artist',
        component: React.lazy(() => import('../pages/Artist'))
      },
      {
        path: '/album',
        component: React.lazy(() => import('../pages/Album'))
      }
    ]
  }
]

export default routes