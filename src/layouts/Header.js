import React, { useEffect, useState } from "react"
import { Menu, Input, Button, AutoComplete } from "antd"
import { SearchOutlined, MailOutlined, AppstoreOutlined, SettingOutlined, ProfileOutlined, UserOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from "react-router-dom"
import { searchSuggest } from '@/api/header.js'
import '@/assets/css/header.scss'

const { SubMenu } = Menu

const Header = () => {
  const [current, setCurrent] = useState('discovery')
  
  const arr = [
    {
      key: 'discovery',
      text: '发现音乐',
      icon: <MailOutlined />,
      sub: [{
        key: 'discover',
        text: '推荐',
        url: '/discover'
      },
      {
        key: 'rank',
        text: '排行榜',
        url: '/discover/toplist'
      },
      {
        key: 'list',
        text: '歌单',
        url: '/discover/playlist'
      },
      {
        key: 'fm',
        text: '主播电台',
        url: '/discover/djradio'
      },{
        key: 'singer',
        text: '歌手',
        url: '/discover/artist'
      },
      {
        key: 'new',
        text: '新碟上架',
        url: '/discover/album'
      }]
    },
    {
      key: 'mine',
      text: '我的音乐',
      icon: <AppstoreOutlined />,
      sub: []
    },
    {
      key: 'friend',
      text: '朋友',
      icon: <SettingOutlined />
    },
    {
      key: 'shop',
      text: '商城',
      icon: <AppstoreOutlined />
    },
    {
      key: 'musician',
      text: '音乐人',
      icon: <SettingOutlined />
    },
    {
      key: 'download',
      text: '下载客户端',
      icon: <SettingOutlined />
    }
  ]

  return (
    <div className='header'>
      <Menu theme='dark' onClick={(e) => setCurrent(e.key)} selectedKeys={[current]} mode="horizontal" style={{textAlign: 'center', background: '#242424' }}>
        {
          arr.map(item => {
            return (
              !item.sub ? (<Menu.Item key={item.key} icon={item.icon}>
                  <Link to='/'>{item.text}</Link>
                </Menu.Item>
              ) : (
                <SubMenu key={item.key} icon={item.icon} title={item.text}>
                  <Menu.ItemGroup>
                    {
                      item.sub.map(i => {
                        return (
                          <Menu.Item key={i.key}>
                            {i.url ? <Link to={i.url}>{i.text}</Link> : i.text}
                          </Menu.Item>
                        )
                      })
                    }
                  </Menu.ItemGroup>
                </SubMenu>)
            )
          })
        }
      </Menu>
      <div className='header-right'>
        <Complete />
        <a className='creator-btn'>创作者中心</a>
        <Button type='text' style={{ color: '#787878' }}>登录</Button>
      </div>
    </div>
  )
}

const renderTitle = (title) => {
  switch(title) {
    case 'albums':
      return <span><PlayCircleOutlined />专辑</span>
      break
    case 'artists':
      return <span><UserOutlined />歌手</span>
      break
    case 'playlists':
      return <span><ProfileOutlined />歌单</span>
      break
    case 'songs':
      return <span><PlayCircleOutlined />单曲</span>
      break
    default:
      return <span>其他</span>
      break
  }
}

const renderItem = (title, path, id, artists, artist) => {
  let art = ''
  if(artists) {
    art = artists?.map(item => item.name).join('/')
  }
  if(artist) {
    art = artist.name
  }
  return {
    value: id.toString(),
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        path={path}
      >
        {art ? `${title} - ${art}` : title}
      </div>
    ),
  }
}

const Complete = () => {
  let history = useHistory()
  const [keywords, setInputVal] = useState('')
  const [options, setOptions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if(!keywords) return
      let params = {
        keywords
      }
      const { result } = await searchSuggest(params)
      const options = []
      result.order.forEach(key => {
        let obj = {
          label: renderTitle(key),
          options: result[key].map(item => renderItem(item.name, key, item.id, item.artists, item.artist))
        }
        options.push(obj)
      })
      setOptions(options)
    }

    fetchData()
  }, [keywords])

  function onSelect(value, option) {
    let { path } = option.label.props
    history.push(`/${path.slice(0, -1)}?id=${value}`)
  }

  return (
    <>
      <AutoComplete
        dropdownClassName="certain-category-search-dropdown"
        backfill={false}
        options={options}
        onSelect={onSelect}
      >
        <Input
          value={keywords}
          onChange={val => setInputVal(val.target.value)}
          placeholder="音乐/视频/电台/用户"
          prefix={<SearchOutlined className="site-form-item-icon" />}
        />
      </AutoComplete>
    </>
  )
}

export default  Header