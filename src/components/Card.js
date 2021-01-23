import React from 'react'
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons"

export const Card = (props) => {
  const { picUrl, name, playCount } = props
  return (
    <div className='card-container'>
      <div className='card'>
        <img src={picUrl} alt={name}/>
        <div className='card-cover'>
          <div className='card-cover__left'>
            <UserOutlined />
            <span>{playCount}</span>
          </div>
          <PlayCircleOutlined style={{ cursor: 'pointer' }} />
        </div>
      </div>
      <div className='card-text'>{name}</div>
    </div>
  )
}