import routes from './index'

/**
 * 添加分割线
 * @param {String} pagePath 
 */
const addSlash = pagePath => pagePath.startsWith('/') ? pagePath : `/${pagePath}`

/**
 * 包装路由
 * @param {Object} route 当前路由对象
 * @param {Object} parentRoute 父路由对象
 */
const wrapRoute = (route, parentRoute = { path: '' }) => {
  const parentPath = addSlash(parentRoute.path)
  const currentPath = addSlash(route.path)
  const path = `${parentPath}${currentPath}`.replace(/\/\//g, '/')
  route.path = path // 把子路由路径拼接上父路由路径

  // 子路由继承父路由的权限
  if(!('access' in route) && ('access' in parentRoute)) {
    route.access = parentRoute.access
  }

  // 是否强制重定向
  if(route.forbiddenRedirect && typeof route.forbiddenRedirect !== 'string') {
    throw new TypeError('forbiddenRedirect 必须是字符串链接')
  }

  let routeList = []

  // 递归地包装子路由
  if(route.routes && route.routes.length) {
    for (const childRoute of route.routes) {
      routeList.push(...wrapRoute(childRoute, route))
    }
  }

  // 上面先把子路由拍平，这里再添加父路由自身
  if(route.component) {
    if(route?.routes?.length) { // 子路由拍平后，父路由可以去掉子路由数组，这样轻便一些
      delete route.routes
    }
    routeList.push(route)
  }

  return routeList
}

/**
 * 
 * @param {Array} routeList 
 */
const getWrapRouteList = (routeList) => {
  let arr = routeList.map(item => 
    wrapRoute(item)
  )
  return arr.flat(Infinity)
}

export default getWrapRouteList(routes)