import React, { createElement, useState, useEffect, useContext } from 'react'
import { useLocation, useHistory, Switch, Route } from 'react-router-dom'
import { Comment, Button, Tag, Tooltip, Avatar } from 'antd'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled, PlayCircleOutlined, FolderAddOutlined, ShareAltOutlined, DownloadOutlined, InfoCircleOutlined, ManOutlined, WomanOutlined, WeiboOutlined, PlusOutlined, MailOutlined } from "@ant-design/icons"
import '@/assets/css/user/home.scss'
import { getUserDetail, getUserPlaylist, getUserRecord, getUserEvent } from '@/api/user'
import { Card } from '@/components/Card';

const IdContext = React.createContext('')

const Profile = () => {
  let history = useHistory()
  const { uid, setNickname } = useContext(IdContext)
  const [data, setData] = useState({})
  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserDetail({ uid })
      setData(res)
      setNickname(res?.profile?.nickname)
    }
    
    fetchData()
  }, [])

  function goTo(pathname) {
    history.push(`/user/${pathname}?id=${uid}`)
  }

  return (
    <div className='user-home__profile'>
      <img src={data?.profile?.avatarUrl} alt={data?.profile?.nickname}/>
      <div>
        <div className='profile-line line1'>
          <h2>{data?.profile?.nickname}</h2>
          {
            data?.profile?.avatarDetail?.identityLevel ? <img src={require(`@/assets/images/level${data?.profile?.avatarDetail?.identityLevel}.png`)} alt={`等级{data?.profile?.avatarDetail?.identiryLevel}`}/> : ''
          }
          {
            data?.profile?.gender === 1 ? <ManOutlined /> : <WomanOutlined />
          }
          <Button icon={<MailOutlined />}>发私信</Button>
          <Button type='primary' icon={<PlusOutlined />}>关注</Button>
          <Button className='check-singer-btn'>查看歌手页</Button>
        </div>
        {
          data?.profile?.allAuthTypes && <div className='profile-line line2'>
            <Tag color="#f50">
              <img style={{ width: '15px', height: '15px', verticalAlign: 'text-bottom' }} src={data?.identify?.imageUrl} alt={data?.identify?.imageDesc}/>音乐人</Tag>
              <span>{data?.profile?.allAuthTypes?.[0]?.desc}</span>
            {
              data?.profile?.allAuthTypes?.[0]?.tags?.map(item => (
                <Tag key={item}>{item}</Tag>
              ))
            }
          </div>
        }
        <div className='profile-line line3'>
          <div onClick={() => goTo('event')}>
            <h3>{data?.profile?.eventCount}</h3>
            <span>动态</span>
          </div>
          <div>
            <h3>{data?.profile?.follows}</h3>
            <span>关注</span>
          </div>
          <div>
            <h3>{data?.profile?.followeds}</h3>
            <span>粉丝</span>
          </div>
        </div>
        <p>个人介绍：{data?.profile?.signature}</p>
        <p>所在地区：浙江省 - 杭州市  年龄：{new Date(data?.profile?.birthday).toLocaleString()}</p>
        <div>社交网络：<WeiboOutlined /></div>
      </div>
    </div>
  )
}

// 听歌排行
const Rank = () => {
  let history = useHistory()
  const { uid } = useContext(IdContext)
  const [data, setData] = useState([])
  const [type, setType] = useState(1)
  useEffect(() => {
    const fetchData = async () => {
      let params = {
        uid,
        type // 1 - 最近一周；0 - 所有时间
      }
      const res = await getUserRecord(params)
      let data = type ? res.weekData : res.allData
      setData(data.slice(0, 10))
    }

    fetchData()
  }, [uid, type])

  function goTo(id) {
    history.push('/song?id=' + id)
  }

  return (
    <>
      {
        data.length ? (<div className='user-home__rank'>
          <div className='user-home__rank-title title'>
            <div className='rank-title'>听歌排行</div>
            <span>累积听歌{data.length}首</span>
            <Tooltip title="实际播放时间过短的歌曲将不纳入计算。">
              <InfoCircleOutlined />
            </Tooltip>
            <div className='time-btn'>
              <span className={type === 1 ? 'active' : 'inactive'} onClick={() => setType(1)}>最近一周</span>
              <span className={type === 0 ? 'active' : 'inactive'} onClick={() => setType(0)}>所有时间</span>
            </div>
          </div>
          <ol className='user-home__rank-list'>
            {
              data.map(item => (
                <li key={item.song.id}>
                  <PlayCircleOutlined />
                  <span onClick={() => goTo(item.song.id)}>{item.song.name}</span>
                  -
                  <span>{item.song.ar.map(it => it.name).join('/')}</span>
                  <div className='hide-btns'>
                    <PlusOutlined />
                    <FolderAddOutlined />
                    <ShareAltOutlined />
                    <DownloadOutlined />
                  </div>
                </li>
              ))
            }
          </ol>
          <Button type='text' style={{ float: 'right' }}>查看更多&gt;</Button>
        </div>) : ''
      }
    </>
  )
}

// 用户创建的歌单/用户收藏的歌单
const Created = () => {
  const { uid, nickname } = useContext(IdContext)
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { playlist } = await getUserPlaylist({ uid })
      let arr = [], a = [], b = []
      playlist.forEach(item => {
        if(item.creator.nickname === nickname) {
          a.push(item)
        } else {
          b.push(item)
        }
      })
      arr = [a, b]
      setList(arr)
    }

    fetchData()
  }, [uid, nickname])

  return (
    <>
      {
        list.map((it, idx) => (
          <div key={idx}>
            {
              it.length ? (<div key={idx} className='user-home__created'>
                <div className='user-home__created-title title'>{nickname}{idx === 0 ? '创建' : '收藏'}的歌单（{it.length}）</div>
                <ul>
                  {
                    it.map(item => {
                      const { coverImgUrl, name, playCount } = item
                      const obj = { picUrl: coverImgUrl, name, playCount }
                      return (
                        <li key={item.id}>
                          <Card key={item.id} {...obj}/>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>) : ''
            }
          </div>
        ))
      }
      
    </>
  )
}

const Event = () => {
  const { uid } = useContext(IdContext)
  const [likes, setLikes] = useState(0)
  const [transmits, setTransmits] = useState(0)
  const [action, setAction] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { events } = await getUserEvent({ uid })
      setEvents(events)
    }

    fetchData()
  }, [uid])

  const like = () => {
    setLikes(1)
    setTransmits(0)
    setAction('liked')
  }

  const transmit = () => {
    setLikes(0)
    setTransmits(1)
    setAction('disliked')
  }

  const actions = (likes, transmits, commentCount) => (
    [
      <Tooltip key="comment-basic-like" title="Like">
        <span onClick={like}>
          {createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
          <span className="comment-action">({likes})</span>
        </span>
      </Tooltip>,
      <Tooltip key="comment-basic-dislike" title="Dislike">
        <span onClick={transmit}>
          转发
          <span className="comment-action">({transmits})</span>
        </span>
      </Tooltip>,
      <span key="comment-basic-reply-to">评论({commentCount})</span>,
    ]
  )

  return (
    <>
      {
        events.map(item => {
          let { json, user, eventTime, info } = item
          json = JSON.parse(json)
          eventTime = new Date(eventTime).toLocaleDateString()
          let { likedCount, shareCount, commentCount } = info
          return (
            <Comment
              key={item.id}
              actions={actions(likedCount, shareCount, commentCount)}
              author={<a>{user.nickname}</a>}
              avatar={
                <Avatar
                  src={user.avatarUrl}
                  alt={user.nickname}
                />
              }
              content={
                <>
                  <span>{eventTime}</span>
                  <p>
                    {json.msg}
                  </p>
                </>
              }
            />
          )
        })
      }
    </>
  )
}

const Home = () => {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })

  const [nickname, setNickname] = useState('')
  
  return (
    <IdContext.Provider value={{ uid: obj.id, nickname, setNickname }}>
      <div>
        <Profile />
        <Switch>
          <Route exact path='/user/home'>
            <Created />
            <Rank />
          </Route>
          <Route exact path='/user/event'>
            <Event />
          </Route>
        </Switch>
        
      </div>
    </IdContext.Provider>
  )
}

export default Home