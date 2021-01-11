import React from 'react'
import '../assets/css/footer.scss'

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-left'>
        <div className='footer-left__row'>
          <div>服务条款</div>
          <div>隐私政策</div>
          <div>儿童隐私政策</div>
          <div>版权投诉指引</div>
          <div>意见反馈</div>
        </div>
        <div>
          <span style={{ marginRight: '20px' }}>违法和不良信息举报电话：0571-89853516</span>
          <span>举报邮箱：ncm5990@163.com</span>
        </div>
      </div>
      <div className='footer-right'>

      </div>
    </div>
  )
}

export default Footer