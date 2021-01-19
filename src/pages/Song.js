import React, { useState, useEffect, useContext } from 'react'
import {
  useLocation
} from 'react-router-dom'
import '../assets/css/song.scss'
import { Button, Input, Pagination } from 'antd'
import { CaretRightOutlined, PlusOutlined, SmileOutlined, LikeOutlined, TrademarkOutlined, UpOutlined, DesktopOutlined, PlayCircleOutlined, FolderAddOutlined, ShareAltOutlined, DownloadOutlined, MessageOutlined, DownOutlined } from '@ant-design/icons'
import { getDetail, getLyric, getComment, getSimiSong } from '../api/song'
import { getCommentNew } from '../api/toplist'

const { TextArea } = Input

const IdContext = React.createContext('')

const Left = () => {
  return (
    <div className='left-container'>
      <Up />
      <Down />
    </div>
  )
}

const Up = () => {
  const id = useContext(IdContext)
  const [song, setSong] = useState({})
  const [lyric, setLyric] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const [{ songs }, { lrc }] = await Promise.all([getDetail({ ids: id }), getLyric({ id })]) 
      setSong(songs[0])
      setLyric(lrc.lyric?.replace(/\[\d*:\d*\.\d*\]/g, '')?.split('\n'))
    }

    fetchData()
  }, [id])

  const [showRest, setShowRest] = useState(false)
  return (
    <div className='up-container'>
      <div className='up-container__left'>
        <img src={song?.al?.picUrl} alt={song?.al?.name}/>
        <div>
          <a href="#" className='text'>生成外链播放器</a>
        </div>
      </div>
      <div className='up-container__right'>
        <div>
          <div>单曲</div>
          <div className='song-name'>{song?.name}</div>
          <DesktopOutlined style={{ fontSize: '21px', color: 'red' }} />
        </div>
        <div>歌手：<span className='text'>{song?.ar?.map(item => item.name).join('/')}</span></div>
        <div>所属专辑：<span className='text'>{song?.al?.name}</span></div>
        <div className='button-group'>
          <Button type='primary' icon={<PlayCircleOutlined />}>播放</Button>
          <Button icon={<FolderAddOutlined />}>收藏</Button>
          <Button icon={<ShareAltOutlined />}>分享</Button>
          <Button icon={<DownloadOutlined />}>下载</Button>
          <Button icon={<MessageOutlined />}>16343</Button>
        </div>
        <div className='lyric'>
          {
            lyric.slice(0, 12).map((item, index) => (
              <p key={index}>{item}</p>
            ))
          }
          {
            showRest && lyric.slice(12).map((item, index) => (
              <p key={index}>{item}</p>
            ))
          }
          <div className='show-btn' onClick={() => setShowRest((flag) => !flag)}>
            {
              showRest ? <>收起<UpOutlined /></> : <>展开<DownOutlined /></>
            }
          </div>
        </div>
        <div className='extra-btn'>
          <span>翻译歌词</span>
          <span>报错</span>
        </div>
        <div className='extra-btn'>
          暂时没有翻译，<span>求翻译</span>
        </div>
      </div>
    </div>
  )
}

const Down = () => {
  const id = useContext(IdContext)
  const [offset, setOffset] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [data, setData] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      let params = {
        id,
        limit: pageSize,
        offset
      }
      const data = await getComment(params)
      setData(data)
    }

    fetchData()
  }, [offset, pageSize])

  function onChange(page, pageSize) {
    setOffset(page)
    setPageSize(pageSize)
  }

  return (
    <div>
      <div className='comment-header'>
        <div className='comment-header__title'>
          <span>评论</span>
          <span>共{data?.total}条评论</span>
        </div>
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
      </div>
      <div className='comment-body'>
        <CommentHot title='精彩评论' comments={data.hotComments}/>
        <CommentHot title={`最新评论（${data.total}）`} comments={data.comments}/>
      </div>
      <Pagination style={{textAlign: 'center', marginBottom: '15px'}} current={offset} pageSize={pageSize} total={data.total} onChange={onChange}/>
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

const Right = () => {
  const id = useContext(IdContext)
  const [simiSong, setSimiSong] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { songs } = await getSimiSong({ id })
      setSimiSong(songs)
    }

    fetchData()
  }, [])
  return (
    <div className='right-container'>
      <div className='right-container__section'>
        <div className='right-container__section-title'>包含这首歌的歌单</div>
        <ul className='song-list'>
          <li>
            <img src="" alt=""/>
            <div>
              <div></div>
              <div></div>
            </div>
          </li>
        </ul>
      </div>
      <div className='right-container__section'>
        <div className='right-container__section-title'>相似歌曲</div>
        <ul className='similar-list'>
          {
            simiSong?.map(item => (
              <li key={item.id}>
                <div>
                  <div>{item?.name}</div>
                  <div>{item?.artists?.map(it => it.name).join('/')}</div>
                </div>
                <div>
                  <CaretRightOutlined />
                  <PlusOutlined />
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <div className='right-container__section'>
        <div className='right-container__section-title'>网易云音乐多端下载</div>
        <div>同步歌单，随时畅听320k好音乐</div>
      </div>
    </div>
  )
}

const Song = () => {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })
  return (
    <IdContext.Provider value={obj.id}>
      <div className='song-page'>
        <Left />
        <Right />
      </div>
    </IdContext.Provider>
  )
}

export default Song