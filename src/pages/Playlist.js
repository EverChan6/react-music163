import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Tabs, Select, Pagination } from 'antd'
import { getCatList, getPlayList } from '../api/index';
import '../assets/css/playlist.scss'
import { PlayCircleOutlined, UserOutlined } from "@ant-design/icons"

const { TabPane } = Tabs
const { Option, OptGroup } = Select

const PlayList = () => {
  const [catlist, setCatlist] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { categories, sub, all } = await getCatList()
      let arr = [{
        category: '全部歌单',
        items: [all]
      }]
      for(const [category, value] of Object.entries(categories)) {
        let items = sub.filter(item => item.category == category)
        let obj = {
          category: value,
          items
        }
        arr.push(obj)
      }

      setCatlist(arr)
    }

    fetchData()
  }, [])

  
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })
  const [tabTitle, setTabTitle] = useState(obj.cat || '全部歌单')
  const [total, setTotal] = useState(0)
  const [playlist, setPlaylist] = useState([])
  const [page, setPage] = useState(1)
  useEffect(() => {
    const fetchData = async () => {
      const { playlists, total } = await getPlayList({
        order: 'hot',
        cat: tabTitle,
        limit: 50,
        offset: page
      })
      setTotal(total)
      setPlaylist(playlists)
    }

    fetchData()
  }, [tabTitle, page])

  return (
    <>
      <div className='custom-tab__header'>
        <div className='custom-tab__header-title'>{tabTitle}</div>
        <Select defaultValue={tabTitle} style={{ width: 200 }} onChange={val => setTabTitle(val)}>
          {
            catlist.map(item => (
              <OptGroup label={item.category} key={item.category}>
                {
                  item.items.map((it, index) => <Option value={it.name} key={it.name}>{it.name}</Option>)
                }
              </OptGroup>
            ))
          }
        </Select>
        <Button>热门</Button>
      </div>
      <div>
        <div>
          {
            playlist.map(item => {
              return (
                <div className='card-container' key={item.id}>
                  <div className='card'>
                    <img src={item.coverImgUrl} alt={item.name}/>
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
        </div>
        <Pagination style={{ textAlign: 'center' }} current={page} total={total} onChange={page => setPage(page)}/>
      </div>
    </>
  )
}

export default PlayList