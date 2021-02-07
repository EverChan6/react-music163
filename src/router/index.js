import React from "react";

// lazy懒加载组件时要搭配Suspense组件使用（Suspense组件我放在了main.js里）

const routes = [
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import('../pages/discover/Discover'))
  },
  {
    path: '/discover',
    exact: true,
    component: React.lazy(() => import('../pages/discover/Discover')),
    routes: [
      {
        path: '/toplist',
        component: React.lazy(() => import('../pages/discover/Toplist'))
      },
      {
        path: '/playlist',
        component: React.lazy(() => import('../pages/discover/Playlist'))
      },
      {
        path: '/djradio',
        component: React.lazy(() => import('../pages/discover/FM'))
      },
      {
        path: '/artist',
        component: React.lazy(() => import('../pages/discover/Artist'))
      },
      {
        path: '/album',
        component: React.lazy(() => import('../pages/discover/Album'))
      }
    ]
  },
  {
    path: '/song',
    exact: true,
    component: React.lazy(() => import('../pages/Song'))
  },
  {
    path: '/album',
    exact: true,
    component: React.lazy(() => import('../pages/Album'))
  },
  {
    path: '/playlist',
    exact: true,
    component: React.lazy(() => import('../pages/Playlist'))
  },
  {
    path: '/user/home',
    exact: true,
    component: React.lazy(() => import('../pages/user/Home'))
  }
]

export default routes