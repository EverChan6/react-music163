import React, { useContext, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Table, Button, Tag } from 'antd'
import { Comment } from './Song'
import { MyButtonGroup } from './Album'
import { PlayCircleOutlined, PlusOutlined, DownloadOutlined, FolderAddOutlined, MessageOutlined, ShareAltOutlined, SmileOutlined, TrademarkOutlined, LikeOutlined } from "@ant-design/icons"
import { getDetail, getComment } from '@/api/toplist'
import { getPlayList } from '@/api/index'
import '@/assets/css/playlist.scss'

const IdContext = React.createContext('')

const Left = (props) => {
  let { id } = useContext(IdContext)
  let { playlist } = props

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => (
        <>
          <span style={{ marginRight: '20px' }}>{index}</span>
          <PlayCircleOutlined style={{ cursor: 'pointer' }}/>
        </>
      )
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
    {
      title: '专辑',
      dataIndex: 'al',
      key: 'al',
      render: al => (
        <span>{al?.name}</span>
      )
    },
  ]

  const [data, setData] = useState({})
  const [offset, setOffset] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    let params = {
      id,
      limit: pageSize,
      offset
    }
    const fetchData = async () => {
      const res = await getComment(params)
      setData(res)
    }

    fetchData()
  }, [id, offset, pageSize])


  const onChange = useCallback((offset, pageSize) => {
    setOffset(offset)
    setPageSize(pageSize)
  }, [offset, pageSize])

  return (
    <div className='album-left'>
      <div className='album-left__section section1'>
        <img src={playlist?.coverImgUrl} alt={playlist?.name} style={{ border: '1px solid #ccc', padding: '5px' }}/>
        <div>
          <div>
            <h2>{playlist?.name}</h2>
          </div>
          <div className='section1-div'>
            <img src={playlist?.creator?.avatarUrl} alt={playlist?.creator?.nickname}/>
            <div>{playlist?.creator?.nickname}</div>
            <span>{new Date(playlist?.createTime).toLocaleDateString()}创建</span>
          </div>
          <MyButtonGroup commentCount={playlist?.commentCount} shareCount={playlist?.shareCount} />
          <div>
            标签：
            {
              playlist?.tags?.map(item => (
                <Tag key={item}>{item}</Tag>
              ))
            }
          </div>
          <div>
            介绍：{playlist?.description}
          </div>
        </div>
      </div>
      <div className='album-left__section section3'>
        <div className='section3-table-title'>
          <h2>歌曲列表</h2>
          <span>{playlist?.tracks?.length}首歌</span>
          <div>
            <a href="#">生成外链播放器</a>
            <span className='play-time'>播放：{playlist?.playCount}次</span>
          </div>
        </div>
        <Table dataSource={playlist?.tracks} columns={columns} rowKey='id' pagination={false} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div>查看更多内容，请下载客户端</div>
        <Button shape="round" style={{ margin: '10px 0', border: 'none', backgroundImage: 'linear-gradient(90deg,#ff5a4c 0%,#ff1d12 100%)', color: '#fff' }}>立即下载</Button>
      </div>
      <div>
        <Comment data={data} offset={offset} pageSize={pageSize} onChange={onChange} />
      </div>
    </div>
  )
}

const Right = (props) => {
  let { subscribers } = props

  const [playlist, setPlaylist] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { playlists } = await getPlayList({
        limit: 5,
        order: 'hot'
      })
      setPlaylist(playlists)
    }

    fetchData()
  }, [])

  return (
    <div className='album-right'>
      <div className='album-right__section s1'>
        <div className='album-right__section-title'>
          <span>喜欢这个歌单的人</span>
        </div>
        <div>
          {
            subscribers?.map(item => (
              <img style={{ width: '35px', height: '35px', margin: '5px 7px' }} key={item.userId} src={item.avatarUrl} alt={item.nickname}/>
            ))
          }
        </div>
      </div>
      <div className='album-right__section s2'>
        <div className='album-right__section-title'>
          <span>热门歌单</span>
        </div>
        <div>
          {
            playlist?.map(item => (
              <div key={item.id} style={{ display: 'flex' }}>
                <img style={{ width: '50px', height: '50px', margin: '5px 7px' }} src={item.coverImgUrl} alt={item.name}/>
                <div>
                  <div style={{ maxWidth: '140px', overflow: 'hidden',  whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{item?.name}</div>
                  <div>by {item?.creator?.nickname}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

const Playlist = () => {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })

  const [playlist, setPlaylist] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const { playlist } = await getDetail({ id: obj.id })
      setPlaylist(playlist)
    }

    fetchData()
  }, [obj.id])
  
  return (
    <IdContext.Provider value={{ id: obj.id }}>
      <div className='album-page'>
        <Left playlist={playlist}/>
        <Right subscribers={playlist?.subscribers} />
      </div>
    </IdContext.Provider>
  )
}

export default Playlist