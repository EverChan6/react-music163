import React, { memo, Suspense } from 'react'
// import { Provider } from 'react-redux'
import { Spin } from 'antd'
import Header from './layouts/Header'
import AppMain from './layouts/AppMain'
import Footer from './layouts/AppMain'

const App = () => {
  return (
    <>
      <Header/>
      <AppMain/>
      {/* <Footer /> */}
    </>
  )
}
export default App