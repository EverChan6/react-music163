import React, { useState } from 'react'
import { Modal, Input } from 'antd'
import '../assets/css/footer.scss'

const { TextArea } = Input

const Footer = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <div className='footer-container'>
      <div className='footer'>
        <div className='footer-left'>
          <div className='footer-left__row'>
            <a href='https://st.music.163.com/official-terms/service' target='_brank'>服务条款</a>
            <a href='https://st.music.163.com/official-terms/privacy' target='_brank'>隐私政策</a>
            <a href='https://st.music.163.com/official-terms/children' target='_brank'>儿童隐私政策</a>
            <a href='https://music.163.com/st/staticdeal/complaints.html' target='_brank'>版权投诉指引</a>
            <a onClick={showModal} >意见反馈</a>
          </div>
          <div>
            <span style={{ marginRight: '20px' }}>违法和不良信息举报电话：0571-89853516</span>
            <span>举报邮箱：ncm5990@163.com</span>
          </div>
        </div>
        <div className='footer-right'>

        </div>
      </div>
      <Modal title="意见反馈" visible={isModalVisible} okText='发送意见' cancelText='取消' onOk={handleOk} onCancel={handleCancel}>
        <p>任何产品中的问题，欢迎反馈给我们</p>
        <TextArea rows={4} placeholder='请输入反馈内容' allowClear={true} className='textarea' />
        <TextArea rows={4} placeholder='请留下联系方式（电话、QQ、邮箱）' allowClear={true}/>
      </Modal>
    </div>
  )
}

export default Footer