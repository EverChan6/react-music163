import React, { useState } from "react";
import { Menu } from "antd";
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";

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
        text: '新碟上架'
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
  )
}

export default  Header