import React from 'react'
import renderRoutes from '../router/renderRoutes'
import wrapRoutes from '../router/wrapRoutes'

const AppMain = () => {
  return (
    <div style={{ width: '930px', margin: '0 auto' }}>
      {renderRoutes(wrapRoutes)}
    </div>
  )
}

export default AppMain