import React, { useEffect, useRef, useState } from 'react'
import { Carousel, Tabs } from 'antd'
import { getBanner, getHotRecommend, getRecommend, getAlbum, getTopList } from "../api/index"
import { PlayCircleOutlined, UserOutlined, LeftOutlined, RightOutlined, FileAddOutlined } from "@ant-design/icons"
import '../assets/index.scss'
import { Link } from 'react-router-dom'

const { TabPane } = Tabs

// 首页轮播图
const HeadCarousel = () => {
  const [banner, setBanner] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { banners } = await getBanner({type: 0})
      setBanner(banners)
    }

    fetchData()
  }, [])

  return (
    <Carousel autoplay={true}>
      {
        banner.map(item => {
          return (
            <div key={item.imageUrl}>
              <img src={item.imageUrl} alt={item.typeTitle}/>
            </div>
          )
        })
      }
    </Carousel>
  )
}


// 热门推荐
const HotRecommend = () => {
  const [tags, setTags] = useState([])
  const [recommend, setRecommend] = useState([])

  const limit = 8

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
    console.log(key)
  }
  return (
    <Tabs defaultActiveKey="1" onChange={callback}>
      <TabPane tab='热门推荐' key='0'>
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
                    <PlayCircleOutlined />
                  </div>
                </div>
                <div className='card-text'>{item.name}</div>
              </div>
            )
          })
        }
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
  const [album, setAlbum] = useState([])
  const carouselRef = useRef(null)

  useEffect(() => {
    const fetchData = async () => {
      let params = {
        limit: 30,
        offset: 0,
        area: 'ALL',
        type: 'new'
      }
      const { monthData, weekData } = await getAlbum(params)
      setAlbum(monthData.slice(0, 10))
    }

    fetchData()
  }, [])

  function goTo(flag) {
    if(flag) {
      carouselRef.current.next()
    }
    else {
      carouselRef.current.prev()
    }
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane className="tab-pane" tab='新碟上架' key="1">
        <LeftOutlined className='left-icon' onClick={() => goTo(false)}/>
        <Carousel dots={false} ref={carouselRef} className='new-album'>
          <div>
            {
              album.slice(0, 5).map(item => {
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
        <RightOutlined className='right-icon' onClick={() => goTo(true)}/>
      </TabPane>
    </Tabs>
  )
}

// 榜单
const TopList = () => {
  const [toplist, setToplist] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { list } = await getTopList()
      setToplist(list.slice(0, 3))
    }

    fetchData()
  }, [])

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab='榜单' key="1">
        <div className='top-list'>
          {
            toplist.map(item => {
              return (
                <div className='top-list__item' key={item.id}>
                  <div className='top-list__item-cover'>
                    <img src={item.coverImgUrl} alt={item.description}/>
                    <div>
                      <h3>{item.name}</h3>
                      <PlayCircleOutlined style={{ marginRight: '10px' }} />
                      <FileAddOutlined />
                    </div>
                  </div>
                  <ul></ul>
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
      <TopList />
    </>
  )
}

export default Discover