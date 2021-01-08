import React, { useState, useEffect } from 'react'
import { Tabs, Pagination } from 'antd'
import { getNewAlbum } from '../api/album'
import { PlayCircleOutlined } from '@ant-design/icons'
import '../assets/css/album.scss'


const { TabPane } = Tabs

const Album = () => {
  const tabs = [{
    text: '全部新碟',
    key: 'ALL'
  },
  {
    text: '华语',
    key: 'ZH'
  },
  {
    text: '欧美',
    key: 'EA'
  },
  {
    text: '韩国',
    key: 'KR'
  },
  {
    text: '日本',
    key: 'JR'
  }]

  const [curTab, setCurTab] = useState('ALL')
  const [newAlbum, setNewAlbum] = useState([])
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(30)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      let params = {
        limit: pageSize,
        offset: current - 1,
        area: curTab
      }
      const { albums, total } = await getNewAlbum(params)
      setNewAlbum(albums)
      setTotal(total)
    }

    fetchData()
  }, [curTab, current, pageSize])

  function callback(key) {
    setCurTab(key)
    setCurrent(1) // 重置页码
  }

  function pageChange(page, pageSize) {
    setCurrent(page)
    setPageSize(pageSize)
  }

  return (
    <>
      <Tabs>
        <TabPane tab='热门新碟' key='1' className='album-container'>
          
        </TabPane>
      </Tabs>
      <Tabs activeKey={curTab} onChange={callback}>
        {
          tabs.map(item => (
            <TabPane tab={item.text} key={item.key} className='album-container'>
              {
                newAlbum.map(it => (
                  <div className='album' key={it.id}>
                    <div className='album-cover'>
                      <img src={it.picUrl} alt={it.name}/>
                      <PlayCircleOutlined className='play-btn' />
                    </div>
                    <div className='album-name'>{it.name}</div>
                    <div className='album-artist'>{it.artists.map(artist => artist.name).join(' / ')}</div>
                  </div>
                ))
              }
            </TabPane>
          ))
        }
      </Tabs>
      <Pagination className='pagenation' current={current} pageSize={pageSize} total={total} onChange={pageChange}/>
    </>
  )
}

export default Album