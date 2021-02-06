import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Tag, Tooltip } from 'antd'
import { PlayCircleOutlined, FolderAddOutlined, ShareAltOutlined, DownloadOutlined, InfoCircleOutlined, ManOutlined, WomanOutlined, WeiboOutlined, PlusOutlined, MailOutlined } from "@ant-design/icons"
import '@/assets/css/user/home.scss'
import { getUserDetail, getUserPlaylist, getUserRecord } from '@/api/user'
import { Card } from '@/components/Card';

const IdContext = React.createContext('')

const Profile = () => {
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
          <div>
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
  return (
    <>
      {
        data.length && <div className='user-home__rank'>
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
                  <span>{item.song.name}</span>
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
        </div>
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
              it.length ? <div key={idx} className='user-home__created'>
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
              </div> : ''
            }
          </div>
        ))
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
        <Created />
        <Rank />
      </div>
    </IdContext.Provider>
  )
}

export default Home