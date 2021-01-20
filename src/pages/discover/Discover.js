import React, { useEffect, useRef, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Carousel, Tabs, Button } from 'antd'
import { getBanner, getHotRecommend, getRecommend, getAlbum, getTopList } from "../../api/index"
import { getNewestAlbum } from '@/api/album'
import { getDetail } from '@/api/toplist'
import { PlayCircleOutlined, UserOutlined, LeftOutlined, RightOutlined, FileAddOutlined, PlusOutlined } from "@ant-design/icons"
import '@/assets/css/index.scss'

const { TabPane } = Tabs

// 首页轮播图
const HeadCarousel = () => {
  let history = useHistory()
  const [banner, setBanner] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { banners } = await getBanner({type: 0})
      setBanner(banners)
    }

    fetchData()
  }, [])

  function goTo(targetId) {
    history.push('/song?id=' + targetId)
  }

  return (
    <Carousel autoplay={true} className='carousel'>
      {
        banner.map(item => {
          return (
            <div key={item.imageUrl}>
              <div style={{ backgroundImage: `url('${item.imageUrl}?imageView&blur=40x20')` }} className='carousel-banner'>
                <img src={item.imageUrl} alt={item.typeTitle} onClick={() => goTo(item.targetId)}/>
              </div>
            </div>
          )
        })
      }
    </Carousel>
  )
}


// 热门推荐
const HotRecommend = () => {
  const limit = 8
  let history = useHistory()

  const [tags, setTags] = useState([])
  const [recommend, setRecommend] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { tags } = await getHotRecommend()
      setTags(tags)
      const { result } = await getRecommend({ limit })
      setRecommend(result)
    }

    fetchData()
  }, [])

  function callback(key) {
    let tabname = ''
    // 匹配点击的歌单类型
    for(let i = 0; i < tags.length; i ++) {
      let item = tags[i]
      if(item.id === +key) {
        tabname = item.name
        break
      }
    }
    history.push('/discover/playlist?cat=' + tabname)
  }

  const operations = <Button type='text' onClick={() => callback(null)}>更多→</Button>

  return (
    <Tabs defaultActiveKey="1" onChange={callback} tabBarExtraContent={operations}>
      <TabPane tab='热门推荐' key='0'>
        <div className='recommend-tabpane'>
        {
          recommend.map(item => {
            return (
              <div className='card-container' key={item.id}>
                <div className='card'>
                  <img src={item.picUrl} alt={item.name}/>
                  <div className='card-cover'>
                    <div className='card-cover__left'>
                      <UserOutlined />
                      <span>{item.playCount}</span>
                    </div>
                    <PlayCircleOutlined style={{ cursor: 'pointer' }} />
                  </div>
                </div>
                <div className='card-text'>{item.name}</div>
              </div>
            )
          })
        }
        </div>
      </TabPane>
      {
        tags.map(item => {
          return (
            <TabPane tab={item.name} key={item.id}>
              Content of {item.name}
            </TabPane>
          )
        })
      }
    </Tabs>
  )
}


// 新碟上架
const NewAlbum = () => {
  const carouselRef = useRef(null)
  let history = useHistory()

  const [album, setAlbum] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { albums } = await getNewestAlbum()
      setAlbum(albums.slice(0, 10))
    }

    fetchData()
  }, [])

  function carouselChange(flag) {
    if(flag) {
      carouselRef.current.next()
    }
    else {
      carouselRef.current.prev()
    }
  }

  function goTo() {
    history.push('/discover/album')
  }

  const operations = <Button type='text' onClick={goTo}>更多→</Button>

  return (
    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
      <TabPane className="tab-pane" tab='新碟上架' key="1">
        <LeftOutlined className='left-icon' onClick={() => carouselChange(false)}/>
        <Carousel dots={false} ref={carouselRef} className='new-album'>
          <div>
            {
              album.slice(0, 5).map(item => {
                return (
                  <div className='card-container' key={item.id}>
                    <div className='card'>
                      <img src={item.picUrl} alt={item.name}/>
                    </div>
                    <div className='album-name'>{item.name}</div>
                    <div className='album-artist'>{item.artists.map(artist => artist.name).join(' / ')}</div>
                  </div>
                )
              })
            }
          </div>
          <div>
            {
              album.slice(5).map(item => {
                return (
                  <div className='card-container' key={item.id}>
                    <div className='card'>
                      <img src={item.picUrl} alt={item.name}/>
                    </div>
                    <div className='card-text'>{item.name}</div>
                  </div>
                )
              })
            }
          </div>
        </Carousel>
        <RightOutlined className='right-icon' onClick={() => carouselChange(true)}/>
      </TabPane>
    </Tabs>
  )
}

// 榜单
const RankList = () => {
  let history = useHistory()
  const [rankNamelist, setToplist] = useState([])
  const [songArr, setSongArr] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { list } = await getTopList()
      const arr = list.slice(0, 3)
      setToplist(arr)
      const parr = arr.map(item => {
        return getDetail({ id: item.id })
      })
      const res = await Promise.all(parr)
      setSongArr(res)
    }

    fetchData()
  }, [])

  function goTo(id) {
    history.push('/discover/toplist?id='+ id || rankNamelist[0].id)
  }

  const operations = <Button type='text' onClick={goTo}>更多→</Button>

  return (
    <Tabs defaultActiveKey="1" tabBarExtraContent={operations}>
      <TabPane tab='榜单' key="1">
        <div className='top-list'>
          {
            rankNamelist.map((item, index) => {
              return (
                <div className='top-list__item' key={item.id}>
                  <div className='top-list__item-cover'>
                    <img src={item.coverImgUrl} alt={item.description} onClick={() => goTo(item.id)}/>
                    <div>
                      <h3 onClick={() => goTo(item.id)}>{item.name}</h3>
                      <PlayCircleOutlined style={{ marginRight: '10px' }} />
                      <FileAddOutlined />
                    </div>
                  </div>
                  <ul className='rank-list'>
                    {
                      songArr?.[index]?.playlist?.tracks?.slice(0, 10).map((it, idx) => {
                        return (
                          <li key={idx} className='rank-list__li'>
                            <span className='rank-list__li-idx'>{idx+1}</span>
                            <span className='rank-list__li-name'>{it.name}</span>
                            <div className='icon-group'>
                              <PlayCircleOutlined/>
                              <PlusOutlined style={{ margin: '0 10px' }}  />
                              <FileAddOutlined />
                            </div>
                          </li>
                        )
                      })
                    }
                  </ul>
                  <Link to={{ pathname: '/discover/toplist', search: '?id='+ item.id }}>查看更多</Link>
                </div>
              )
            })
          }
        </div>
      </TabPane>
    </Tabs>
  )
}

function Discover() {
  return (
    <>
      <HeadCarousel />
      <HotRecommend />
      <NewAlbum />
      <RankList />
    </>
  )
}

export default Discover