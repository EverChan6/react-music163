import React from 'react'
import Header from './layouts/Header'
import AppMain from './layouts/AppMain'
import Footer from './layouts/Footer'
import { BackTop } from 'antd'

const App = () => {
  
  const style = {
    height: 50,
    width: 50,
    textAlign: 'center',
    fontSize: 14,
  }

  return (
    <>
      <Header/>
      <AppMain/>
      <Footer />
      <BackTop style={style}>
        <div style={{borderRadius: 4, border: '1px solid #ddd'}}>
          <div>^</div>
          <div>TOP</div>
        </div>
      </BackTop>
    </>
  )
}
export default App