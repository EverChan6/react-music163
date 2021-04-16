import React, { createElement, useState, useEffect, useContext, useCallback, useMemo } from 'react'
import { useLocation, useHistory, Switch, Route } from 'react-router-dom'
import { Comment, Button, Tag, Tooltip, Avatar, Pagination } from 'antd'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled, ToTopOutlined, SendOutlined,
   CaretRightOutlined, PlayCircleOutlined, FolderAddOutlined, ShareAltOutlined, DownloadOutlined,
  InfoCircleOutlined, ManOutlined, WomanOutlined, WeiboOutlined, PlusOutlined, MailOutlined, UpOutlined } from "@ant-design/icons"
import '@/assets/css/user/home.scss'
import { getUserDetail, getUserPlaylist, getUserRecord, getUserEvent, 
  getVideo, getCommentOfEvent, getFollows, getFolloweds } from '@/api/user'
import { Card } from '@/components/Card'
import {
  CommentArea,
  CommentList
} from '@/components/MyComment'

const IdContext = React.createContext('')

const Profile = () => {
  let history = useHistory()
  const { uid, setNickname, setFollows, setFolloweds } = useContext(IdContext)
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserDetail({ uid })
      setData(res)
      setNickname(res?.profile?.nickname)
      setFollows(res?.profile?.follows)
      setFolloweds(res?.profile?.followeds)
    }
    
    fetchData()
  }, [uid])

  function goTo(pathname) {
    history.push(`/user/${pathname}?id=${uid}`)
  }

  return (
    <div className='user-home__profile'>
      <img src={data?.profile?.avatarUrl} alt={data?.profile?.nickname}/>
      <div>
        <div className='profile-line line1'>
          <h2>{data?.profile?.nickname}</h2>
          {/* data?.profile?.avatarDetail?.identityLevel ? <img src={require(`@/assets/images/level${data?.profile?.avatarDetail?.identityLevel}.png`)} alt={`等级{data?.profile?.avatarDetail?.identiryLevel}`}/> : '' */}
          {
            data?.profile?.avatarDetail?.identityLevel ? <img src={require(`@/assets/images/level1.png`)} alt={`等级{data?.profile?.avatarDetail?.identiryLevel}`}/> : ''
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
          <div onClick={() => goTo('follows')}>
            <h3>{data?.profile?.follows}</h3>
            <span>关注</span>
          </div>
          <div onClick={() => goTo('fans')}>
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
  }, [uid])

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

// 动态
const Event = () => {
  const { uid } = useContext(IdContext)
  const [likes, setLikes] = useState(0)
  const [transmits, setTransmits] = useState(0)
  const [action, setAction] = useState(null)
  const [eventData, setEventData] = useState({})
  const [more, setMore] = useState(true)
  const [threadId, setThreadId] = useState(null)
  const [follow, setFollow] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { follow } = await getFollows({ uid })
      setFollow(follow)
    }

    fetchData()
  }, [uid])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUserEvent({ uid })
      data?.events.forEach(item => {
        item.showComment = false
        item.commentData = {}
      })
      setEventData(data)
      setMore(data.more)
    }

    more && fetchData()
  }, [uid, more])

  useEffect(() => {
    const fetchData = async () => {
      const res = await getCommentOfEvent({ threadId })
      res.comments = res.comments.slice(0, 10) // 先展示10条，其余的收起
      setEventData(data => {
        let eventData = JSON.parse(JSON.stringify(data)) // !：更新对象中的某一项时，即使这个某一项是个数组，也要把整个外层对象更新，视图才会更新
        for(let i = 0; i < eventData.events.length; i ++) {
          if(eventData.events[i].info.threadId === threadId) {
            eventData.events[i].commentData = res
            break
          }
        }
        return eventData
      })
    }

    threadId && fetchData()
  }, [threadId])

  function showCommentItem(threadId) {
    setEventData(data => {
      let eventData = JSON.parse(JSON.stringify(data)) // !：更新对象中的某一项时，即使这个某一项是个数组，也要把整个外层对象更新，视图才会更新
      for(let i = 0; i < eventData.events.length; i ++) {
        if(eventData.events[i].info.threadId === threadId) {
          eventData.events[i].showComment = !eventData.events[i].showComment
          break
        }
      }
      return eventData
    })
    setThreadId(threadId)
  }

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

  const actions = (likes, transmits, commentCount, threadId) => (
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
      <span key="comment-basic-reply-to" onClick={() => showCommentItem(threadId)}>评论({commentCount})</span>,
    ]
  )

  return (
    <>
      <div className='user-home__event-title title'>TA的动态({eventData.size})</div>
      <div className='user-home__event'>
        <div className='user-home__event-left'>
          {
            eventData?.events?.map(item => {
              let { json, user, eventTime, info, pics, lotteryEventData } = item
              json = JSON.parse(json)
              eventTime = new Date(eventTime).toLocaleDateString()
              let { likedCount, shareCount, commentCount } = info
              return (
                <div key={item.id}>
                  <Comment
                    className='event-li'
                    actions={actions(likedCount, shareCount, commentCount, info.threadId)}
                    author={<a style={{color: '#0c73c2', fontSize: '14px'}}>{user.nickname}</a>}
                    avatar={
                      <Avatar
                        src={user.avatarUrl}
                        alt={user.nickname}
                      />
                    }
                    content={
                      <>
                        <span style={{color: '#999', fontSize: '12px'}}>{eventTime}</span>
                        <p>
                          {json.msg}
                        </p>
                        {
                          json.video && <VideoComp video={json.video} />
                        }
                        {
                          json.resource && <ResourceComp resource={json.resource} pics={pics}/>
                        }
                        {
                          json.event && <EventComp event={json.event} nickname={user.nickname}/>
                        }
                        {
                          json.song && <EventComp event={{ json, lotteryEventData, info, pics }}/>
                        }
                      </>
                    }
                  />
                  {
                    item.showComment && (
                      <div className='comment-list'>
                        <CommentArea />
                        <CommentList data={item.commentData}/>
                        <div className='see-more'>
                          <div>后面还有{}条评论，<a >查看更多&gt;</a></div>
                          <span>收起<UpOutlined /></span>
                        </div>
                      </div>
                    )
                  }
                </div>
              )
            })
          }
        </div>
        <div className='user-home__event-right'>
          <div>
            <h3>TA的关注</h3>
            <ul className='follow-list'>
              {
                follow.map(item => (
                  <li key={item.userId}>
                    <img src={item.avatarUrl} alt={item.nickname}/>
                    <div>
                      <div className='follow-li__nickname' title={item.nickname}>{item.nickname}</div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}

const VideoComp = (prop) => {
  let { video } = prop

  const [mediaType, setMediaType] = useState(0)
  const [videoUrl, setVideoUrl] = useState(null)
  const [videoId, setVideoId] = useState(null)

  function setVideoInfo(mediaType) {
    setMediaType(mediaType)
    setVideoId(video.videoId)
  }

  useEffect(() => {
    const fetchData = async () => {
      const { urls } = await getVideo({ id: videoId })
      setVideoUrl(urls[0].url)
    }

    videoId && fetchData()
  }, [videoId])

  return (
    <>
      {
        mediaType === 0 ? (
          <div style={{backgroundImage: `url(${video.coverUrl})`}} className='cover-div'>
            <div className='cover-title'>
              <span>{video.title}</span>
              <span> - by {video.creator.nickname}</span>
            </div>
            <div className='cover-playbtn'>
              <PlayCircleOutlined className='play-btn' onClick={() => setVideoInfo(1)} />
            </div>
            <div className='cover-info'>
              <div>
                <CaretRightOutlined />
                <span>{video.playTime}</span>
              </div>
              <div>
                <CaretRightOutlined />
                <span>{video.duration}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className='video-title'>
              <div>
                <ToTopOutlined />
                <span onClick={() => setMediaType(0)}>收起</span>
              </div>
              <div>
                <SendOutlined />
                <span>{video.title}</span>
                <span>{video.creator.nickname}</span>
              </div>
            </div>
            <video src={videoUrl} autoPlay controls width='570px' height='320px'></video>
          </div>
        )
      }
    </>
  )
}

const EventComp = (prop) => {
  let { event: { json, lotteryEventData, pics, info }, nickname } = prop
  json = typeof json === 'object' ? json: JSON.parse(json)
  let lottery = lotteryEventData?.title ? (`${lotteryEventData?.title}(${lotteryEventData?.status === 2 ? '已开奖': '未开奖'})`) : ''
  let { likedCount, shareCount, commentCount } = info
  return (
    <div className='event-div' style={{backgroundColor: nickname ? '#f5f5f5' : '#ffffff'}}>
      <div className='event-msg'>
        {
          nickname ? (
            <>
              <a style={{color: '#0c73c2'}}>@{nickname} </a>
              分享单曲：
            </>
          ) : ''
        }
        
        {
          nickname ? (
            <>
              <a style={{color: '#0c73c2'}}>{lottery}</a>
              {json.msg}
            </>
          ) : ''
        }
      </div>
      <div className='event-div__album' style={{backgroundColor: nickname ? '#ffffff' : '#f5f5f5'}}>
        <div style={{backgroundImage: `url(${json.song.album.picUrl})`}}>
          <PlayCircleOutlined className='play-btn' />
        </div>
        <div>
          <div>{json.song.name}</div>
          <div>
            {
              json.song.artists.map(item => item.name).join('/')
            }
          </div>
        </div>
      </div>
      {
        pics?.map((item, idx) => (
          <img className='pic' key={idx} src={item.originUrl} alt={item.originUrl}/>
        ))
      }
      {
        nickname && <div>
          <Tooltip>
            <span className='action-btn'>
              {createElement(LikeFilled)}
              <span>({likedCount})</span>
            </span>
          </Tooltip>
          <Tooltip>
            <span className='action-btn action'>
              转发
              <span>({shareCount})</span>
            </span>
          </Tooltip>
          <span className='action-btn action'>评论({commentCount})</span>
        </div>
      }
    </div>
  )
}

const ResourceComp = (prop) => {
  let { resource, pics } = prop
  return (
    <div className='resource-div'>
      <div className='resource-div__title'>
        {
          resource.img80x80 ? <img src={resource.img80x80} alt={resource.img80x80}/> :
            <img src={resource.coverImgUrl || resource?.mlogBaseData?.coverUrl} alt={resource.coverImgUrl || resource?.mlogBaseData?.coverUrl}/>
        }
        {
          resource.title ? <div>{resource.title}</div> : <div>歌手：<span>{resource.name || resource?.userProfile?.nickname}</span></div>
        }
      </div>
      {
        pics.map((item, idx) => (
          <img className='pic' key={idx} src={item.originUrl} alt={item.originUrl}/>
        ))
      }
    </div>
  )
}

const Follow = (prop) => {
  let history = useHistory()
  const { uid, follows, followeds } = useContext(IdContext)
  const { compType } = prop
  const [follow, setFollow] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    const fetchData = async () => {
      const { follow } = await getFollows({ uid, limit: pageSize, offset: current - 1 })
      setFollow(follow)
    }

    const fetchData2 = async () => {
      const { followeds } = await getFolloweds({ uid, limit: pageSize, time: follow.length ? follow[follow.length - 1].time : '-1' })
      setFollow(followeds)
    }

    compType === '1' ? fetchData() : fetchData2()
  }, [uid, current, pageSize])

  const onChange = (page, pageSize) => {
    setCurrent(page)
    setPageSize(pageSize)
  }

  const goTo = (pathname, uid) => {
    history.push(`/user/${pathname}?id=${uid}`)
  }

  return (
    <div>
      <div className='user-home__follow-title title'>
        {
          compType === '1' ? `关注(${follows})` : `粉丝(${followeds})`
        }
      </div>
      <ul className='follow-div'>
        {
          follow.map(item => (
            <li key={item.userId}>
              <img style={{cursor: 'pointer'}} src={item.avatarUrl} alt={item.avatarUrl} onClick={() => goTo('home', item.userId)}/>
              <div className='li-div'>
                <div className='li-div-div'>
                  <span className='blue-text click-text' onClick={() => goTo('home', item.userId)}>{item.nickname}</span>
                </div>
                <div className='li-div-div'>
                  <span className='click-text' onClick={() => goTo('event', item.userId)}>动态<span className='blue-text'>{item.eventCount}</span></span>
                  <span className='click-text' onClick={() => goTo('follows', item.userId)}>关注<span className='blue-text'>{item.follows}</span></span>
                  <span className='click-text' onClick={() => goTo('fans', item.userId)}>粉丝<span className='blue-text'>{item.followeds}</span></span>
                </div>
                <div className='li-div-div'>{item.signature}</div>
              </div>
              <Button type="primary" icon={<PlusOutlined />}>关注</Button>
            </li>
          ))
        }
      </ul>
      <Pagination style={{textAlign: 'center'}} current={current} pageSize={pageSize} onChange={onChange} total={compType === '1' ? follows : followeds}/>
    </div>
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
  const [followeds, setFolloweds] = useState('')
  const [follows, setFollows] = useState('')

  return (
    <IdContext.Provider value={{ uid: obj.id, nickname, setNickname, follows, setFollows, followeds, setFolloweds }}>
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
          <Route exact path='/user/follows'>
            <Follow compType='1'/>
          </Route>
          <Route exact path='/user/fans'>
            <Follow compType='2'/>
          </Route>
        </Switch>
        
      </div>
    </IdContext.Provider>
  )
}

export default Home