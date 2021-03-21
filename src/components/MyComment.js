import React from 'react'
import { Button, Input } from 'antd'
import { SmileOutlined, LikeOutlined, TrademarkOutlined } from '@ant-design/icons'
import '../assets/css/song.scss'

const { TextArea } = Input

const CommentTitle = (props) => {
    const { total } = props
    return (
        <div className='comment-header__title'>
            <span>评论</span>
            <span>共{total}条评论</span>
        </div>
    )
}

const CommentArea = () => {
    return (
          <div className='comment-header__submit-area'>
            <img src="" alt=""/>
            <div className='comment-header__btn-group'>
              <TextArea rows={4} placeholder='评论'/>
              <div>
                <TrademarkOutlined />
                <SmileOutlined />
              </div>
              <div>
                <span>140</span>
                <Button>评论</Button>
              </div>
            </div>
          </div>
    )
}

  const CommentList = (props) => {
    const { data } = props
    return (
      <div>
        <div className='comment-body'>
          <CommentHot title='精彩评论' comments={data.hotComments}/>
          <CommentHot title={`最新评论（${data.total}）`} comments={data.comments}/>
        </div>
      </div>
    )
  }

  const CommentHot = React.memo((props) => {
    const { title, comments } = props
    return (
      <div className='comment-body__section'>
        <div className='comment-body__title'>
          {title}
        </div>
        <ul>
          {
            comments?.map(item => (
              <CommentItem data={item} key={item.commentId}/>
            ))
          }
        </ul>
      </div>
    )
  })

  const CommentItem = (props) => {
    const { data } = props
    return (
      <li className='comment-item'>
        <img src={data.user.avatarUrl} alt={data.user.nickname}/>
        <div className='comment-item__right'>
          <div className='comment-item__oneself'>
            <span className='comment-item__user'>{data.user.nickname}：</span>
            {data.content}
          </div>
          {
            data?.beReplied?.length > 0 ? (
              <div className='refer-comment'>
                <span className='comment-item__user'>{data?.beReplied[0].user.nickname}：</span>
                {data?.beReplied[0].content}
              </div>
            ) : ''
          }
          <div className='comment-item__bottom-area'>
            <span>{new Date(data?.time).toLocaleString()}</span>
            <div>
              <LikeOutlined />
              {data.likedCount > 0 ? <span>（1）</span>: ''}
              <Button type='text' className='reply-btn'>回复</Button>
            </div>
          </div>
        </div>
      </li>
    )
  }

export {
    CommentTitle,
    CommentArea,
    CommentList
}