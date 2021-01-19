import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Discover from '../pages/Discover'

// 渲染路由的方法
const renderRoutes = (routes, userInfo = {}, switchProps = {}) => routes
  ? (
    <Switch {...switchProps}>
      {
        routes.map((route, index) => {
          const { key, path, exact = true, strict, component: RouteComponent, access } = route
          return (
            <Route 
              key={key || index}
              path={path}
              exact={exact}
              strict={strict}
              render={props => {
                const hasRight = (access instanceof Function) ? access(userInfo) : true
                return (
                  hasRight
                  ? <RouteComponent {...props} route={route} />
                  : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
              }}
            />
          )
        })
      }
      <Route component={Discover} />
    </Switch>
  )
  : null

  export default renderRoutes