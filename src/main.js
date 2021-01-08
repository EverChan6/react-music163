import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'
import App from './App.js'
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<h1>Loading...</h1>}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()