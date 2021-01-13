import React, { useState, useEffect, useContext } from 'react'
import {
  useLocation
} from 'react-router-dom'
import '../assets/css/song.scss'
import { Button } from 'antd'
import { UpOutlined, DesktopOutlined, PlayCircleOutlined, FolderAddOutlined, ShareAltOutlined, DownloadOutlined, MessageOutlined, DownOutlined } from '@ant-design/icons'
import { getDetail, getLyric } from '../api/song'

const IdContext = React.createContext('')

const Left = () => {
  return (
    <>
      <Up />
      <Down />
    </>
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
          <div className='song-name'>{song.name}</div>
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
          <div onClick={() => setShowRest((flag) => !flag)}>
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
  return (
    <div></div>
  )
}

const Right = () => {
  return (
    <div className='right-container'></div>
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