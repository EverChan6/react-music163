import React from 'react'
import { Switch, Route } from "react-router-dom";
import routes from '../router'

// TODO: lazy懒加载组件时要搭配Suspense组件使用（我放在了main.js里）
const Toplist = React.lazy(() => import("../pages/Toplist"))
const Playlist = React.lazy(() => import("../pages/Playlist"))

const AppMain = () => {
  return (
    <div style={{ width: '930px', margin: '0 auto' }}>
      <Switch>
        {
          routes.map((route, index) => (
            <Route exact={route.exact} key={index} path={route.path} render={props => (
              // pass the sub-routes down to keep nesting
              <route.component {...props} routes={route.routes} />
            )} />
          ))
        }
      </Switch>
    </div>
  )
}

export default AppMain