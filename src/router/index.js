import React from "react";

// <!DOCTYPE html>: lazy懒加载组件时要搭配Suspense组件使用（我放在了main.js里）
// TODO:嵌套路由失效
const routes = [
  {
    path: '/',
    exact: true,
    component: React.lazy(() => import("../pages/Discover"))
  },
  {
    path: '/discover',
    exact: true,
    component: React.lazy(() => import('../pages/Discover'))
  },
  {
    path: '/discover/toplist',
    component: React.lazy(() => import('../pages/Toplist'))
  },
  {
    path: '/discover/playlist',
    component: React.lazy(() => import('../pages/Playlist'))
  },
  {
    path: '/discover/djradio',
    component: React.lazy(() => import('../pages/FM'))
  },
  {
    path: '/discover/artist/',
    component: React.lazy(() => import('../pages/Artist'))
  },
]

export default routes