import { Table } from 'antd'
import '@/assets/css/album.scss'
import { ButtonGroup } from 'antd/lib/button/button-group'
import { Comment, CommentHot, CommentItem } from './Song'
import { getCommentOfAlbum } from '@/api/album.js'
import { useState } from 'react'

const IdContext = React.createContext('')

const dataSource = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '歌曲列表',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '时长',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '歌手',
    dataIndex: 'address',
    key: 'address',
  },
]


const Left = () => {
  const id = useContext(IdContext)
  const [data, setData] = useState({})
  const [offset, setOffset] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    const fetchData = async () => {
      const res = await getCommentOfAlbum({ id })
      setData(res)
    }

    fetchData()
  }, [offset, pageSize])

  function onChange(page, pageSize) {
    setOffset(page)
    setPageSize(pageSize)
  }
  return (
    <div className='album-left'>
      <div className='album-left__section section1'>
        <img src="" alt=""/>
        <div>
          <div>
            <h2>四海为家</h2>
          </div>
          <div>歌手：赵照</div>
          <div>发行时间：2021-01-20</div>
          <div>发行公司： 天津市武清区观照文化传媒工作室</div>
          <ButtonGroup />
        </div>
      </div>
      <div className='album-left__section section2'>
        <div>专辑介绍：</div>
        <p>你看 这野草 这蒲公英 这天上的云彩 这朔风里的雪花......他们何以为家？</p>
      </div>
      <div className='album-left__section section3'>
        <div>
          <h2>包含歌曲列表</h2>
          <span>2首歌</span>
          <a href="#">生成外链播放器</a>
        </div>
        <Table dataSource={dataSource} columns={columns} />
      </div>
      <div>
        <Comment data={data} offset={offset} pageSize={pageSize} onChange={onChange} />
      </div>
    </div>
  )
}

export const ButtonGroup = (props) => {
  return (
    <div className='button-group'>
      <Button type='primary' icon={<PlayCircleOutlined />}>播放</Button>
      <Button icon={<FolderAddOutlined />}>收藏</Button>
      <Button icon={<ShareAltOutlined />}>分享</Button>
      <Button icon={<DownloadOutlined />}>下载</Button>
      <Button icon={<MessageOutlined />}>16343</Button>
    </div>
  )
}

const Right = () => {
  return (
    <div className='album-right'></div>
  )
}

const Album = () => {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })
  return (
    <IdContext.Provider value={obj.id}>
      <div className='album-page'>
        <Left />
        <Right />
      </div>
    </IdContext.Provider>
  )
}

export default Album