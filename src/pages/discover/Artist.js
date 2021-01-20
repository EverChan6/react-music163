import React, { useEffect, useState, useContext } from 'react'
import { Button, Tabs } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getTopArtist, getArtistList } from '@/api/artist'
import '@/assets/css/discover/artist.scss'

const { TabPane } = Tabs

const ArtistLeft = (props) => {
  const arr = [{
    category: '推荐',
    catId: '-1', // 全部
    ul: [{
      text: '推荐歌手',
      id: '1'
    }, {
      text: '入驻歌手',
      id: '2'
    }]
  },
  {
    category: '华语',
    catId: '7',
    ul: [{
      text: '华语男歌手',
      id: '1'
    }, {
      text: '华语女歌手',
      id: '2'
    }, {
      text: '华语组合/乐队',
      id: '3'
    }]
  },
  {
    category: '欧美',
    catId: '96',
    ul: [{
      text: '欧美男歌手',
      id: '1'
    }, {
      text: '欧美女歌手',
      id: '2'
    }, {
      text: '欧美组合/乐队',
      id: '3'
    }]
  },
  {
    category: '日本',
    catId: '8',
    ul: [{
      text: '日本男歌手',
      id: '1'
    }, {
      text: '日本女歌手',
      id: '2'
    }, {
      text: '日本组合/乐队',
      id: '3'
    }]
  },
  {
    category: '韩国',
    catId: '16',
    ul: [{
      text: '韩国男歌手',
      id: '1'
    }, {
      text: '韩国女歌手',
      id: '2'
    }, {
      text: '韩国组合/乐队',
      id: '3'
    }]
  },
  {
    category: '其他',
    catId: '0',
    ul: [{
      text: '其他男歌手',
      id: '1'
    }, {
      text: '其他女歌手',
      id: '2'
    }, {
      text: '其他组合/乐队',
      id: '3'
    }]
  }]
  return (
    <div className='artist-left'>
      <ul>
        {
          arr.map((item, index) => (
            <li key={index}>
              <h3>{item.category}</h3>
              <ul>
                {
                  item.ul.map((it, idx) => (
                    <li className={(props.type == it.id && props.area == item.catId) ? 'li-active' : 'li'} key={idx} onClick={() => props.onChange(item.catId, it.id, it.text)}>{it.text}</li>
                  ))
                }
              </ul>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

const ArtistRight = (props) => {
  const [list, setList] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      let params = {
        type: props.type,
        area: props.area,
        limit: 30,
        offset: 0,
        // initial: ''
      }
      const { artists } = await getArtistList(params)
      setList(artists)
    }

    fetchData()
  }, [props.type, props.area])
  return (
    <div className='artist-right'>
      <Tabs tabBarExtraContent={<Button type="text">更多&gt;</Button>}>
        <TabPane tab={props.tabName} key='1' className='artists-container'>
          {
            list.slice(0, 10).map((it) => (
              <div key={it.id} className='artists-container__item'>
                <img src={it.picUrl} alt={it.name}/>
                <div>
                  <span className='artist-name'>{it.name}</span>
                  <div title={it.name + '的个人主页'}><UserOutlined/></div>
                </div>
              </div>
            ))
          }
          {
            list.slice(10).map(it => (
              <div key={it.id} className='artists-container__item2'>
                <span className='artist-name'>{it.name}</span>
                <div title={it.name + '的个人主页'}><UserOutlined/></div>
              </div>
            ))
          }
        </TabPane>
      </Tabs>
    </div>
  )
}


const Artist = () => {
  const [type, setType] = useState(-1)
  const [area, setArea] = useState(-1)
  const [tabName, setTabName] = useState('热门歌手')
  
  function onChange(catId, id, text) {
    setArea(catId)
    setType(id)
    setTabName(text)
  }

  return (
    <div className='artist-page'>
      <ArtistLeft type={type} area={area} onChange={onChange} />
      <ArtistRight type={type} area={area} tabName={tabName}/>
    </div>
  )
}
export default Artist