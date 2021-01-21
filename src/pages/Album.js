import React, { useState, useEffect, useContext, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Table, Button } from 'antd'
import { PlayCircleOutlined, PlusOutlined, DownloadOutlined, FolderAddOutlined, MessageOutlined, ShareAltOutlined, SmileOutlined, TrademarkOutlined, LikeOutlined } from "@ant-design/icons"
import '@/assets/css/album.scss'
import { Comment, CommentHot, CommentItem } from './Song'
import { getContentOfAlbum, getCommentOfAlbum, getArtistAlbum } from '@/api/album.js'

const IdContext = React.createContext('')

const Left = () => {
  const { id, getSingerId } = useContext(IdContext)

  const [album, setAlbum] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const res = await getContentOfAlbum({ id })
      setAlbum(res)
      getSingerId(res?.album?.artist?.id)
    }

    fetchData()
  }, [id])

  const [data, setData] = useState({})
  const [offset, setOffset] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    const fetchData = async () => {
      const res = await getCommentOfAlbum({ id })
      setData(res)
    }

    fetchData()
  }, [id, offset, pageSize])


  const onChange = useCallback((page, pageSize) => {
    setOffset(page)
    setPageSize(pageSize)
  }, [])
  
  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index
    },
    {
      title: '歌曲标题',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时长',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '歌手',
      dataIndex: 'ar',
      key: 'ar',
      render: ar => (
        <span>{ar?.map(item => item.name).join('/')}</span>
      )
    },
  ]

  return (
    <div className='album-left'>
      <div className='album-left__section section1'>
        <img src={album?.album?.picUrl} alt={album?.album?.name}/>
        <div>
          <div>
            <h2>{album?.album?.name}</h2>
          </div>
          <div>歌手：{album?.album?.artists?.map(item => item.name).join('/')}</div>
          <div>发行时间：{new Date(album?.album?.publishTime).toLocaleDateString()}</div>
          <div>发行公司： {album?.album?.company}</div>
          <MyButtonGroup commentCount={album?.album?.info?.commentCount} shareCount={album?.album?.info?.shareCount} />
        </div>
      </div>
      <div className='album-left__section section2'>
        <div>专辑介绍：</div>
        <p>{album?.album?.description}</p>
      </div>
      <div className='album-left__section section3'>
        <div className='section3-title'>
          <h2>包含歌曲列表</h2>
          <span>{album?.songs?.length}首歌</span>
          <a href="#">生成外链播放器</a>
        </div>
        <Table dataSource={album?.songs} columns={columns} rowKey='id' pagination={false} />
      </div>
      <div>
        <Comment data={data} offset={offset} pageSize={pageSize} onChange={onChange} />
      </div>
    </div>
  )
}

export const MyButtonGroup = React.memo((props) => {
  const { commentCount, shareCount } = props
  return (
    <div className='button-group'>
      <Button type='primary' icon={<PlayCircleOutlined />}>播放</Button>
      <Button type='primary' icon={<PlusOutlined />}></Button>
      <Button icon={<FolderAddOutlined />}>收藏</Button>
      <Button icon={<ShareAltOutlined />}>分享({shareCount})</Button>
      <Button icon={<DownloadOutlined />}>下载</Button>
      <Button icon={<MessageOutlined />}>({commentCount})</Button>
    </div>
  )
})

const Right = () => {
  const { singerId } = useContext(IdContext)
  const [hotAlbums, setHotAlbum] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      if(singerId) {
        const { hotAlbums } = await getArtistAlbum({ id: singerId })
        setHotAlbum(hotAlbums.slice(0, 4))
      }
    }

    fetchData()
  }, [singerId])
  return (
    <div className='album-right'>
      <div className='album-right__section s1'>
        <div className='album-right__section-title'>
          <span>喜欢这张专辑的人</span>
        </div>
      </div>
      <div className='album-right__section s1'>
        <div className='album-right__section-title'>
          <span>Ta的其他热门专辑</span>
          <span>全部&gt;</span>
        </div>
        <ul className='ul'>
          {
            hotAlbums.map(item => (
              <li key={item.id} className='li'>
                <img src={item.picUrl} alt={item.name}/>
                <div>
                  <div>{item.name}</div>
                  <div>{new Date(item.publishTime).toLocaleDateString()}</div>
                </div>
              </li>
            ))
          }
        </ul>
      </div>
      <div className='album-right__section s1'>
        <div className='album-right__section-title'>
          <span>网易云音乐多端下载</span>
        </div>
      </div>
    </div>
  )
}

const Album = () => {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })
  console.log(123123123)
  const [singerId, setSingerId] = useState('')
  const getSingerId = useCallback((id) => setSingerId(id), [])
  return (
    <IdContext.Provider value={{ id: obj.id, singerId, getSingerId }}>
      <div className='album-page'>
        <Left />
        <Right />
      </div>
    </IdContext.Provider>
  )
}

export default Album