import React, { useState, useEffect, useContext } from "react"
import { useLocation } from "react-router-dom"
import { Table, Button, Pagination } from 'antd'
import { PlayCircleOutlined, DownloadOutlined, FolderAddOutlined, MessageOutlined, ShareAltOutlined, SmileOutlined, TrademarkOutlined, LikeOutlined } from "@ant-design/icons"
import '../assets/css/toplist.scss'
import { getSummary, getDetail, getCommentNew } from "../api/toplist"

// !!一定是在组件外部创建，不能在任何一个组件内部创建
const IdContext = React.createContext({})

const ToplistLeft = (props) => {
  const [rankList, setRankList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { list } = await getSummary()
      setRankList(list)
    }

    fetchData()
  }, [])
  
  return (
    <div className='left-container'>
      <RankItem title='云音乐特色榜' rankList={rankList.slice(0, 4)} idChange={props.idChange}/>
      <RankItem title='全球媒体榜' rankList={rankList.slice(4)} idChange={props.idChange}/>
    </div>
  )
}

const RankItem = (props) => {
  const { listId } = useContext(IdContext)

  return (
    <div className='left-container__item'>
      <h3>{props.title}</h3>
      <ul style={{ paddingLeft: 0 }}>
        {
          props.rankList.map(item => {
            return (
              <li className={['li', listId == item.id ? 'li-active' : ''].join(' ')} key={item.id} onClick={() => props.idChange(item.id)}>
                <img src={item.coverImgUrl} alt={item.description}/>
                <div>
                  <h4>{item.name}</h4>
                  <span>{item.updateFrequency}</span>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

const ToplistRight = () => {
  const { listId } = useContext(IdContext)
  const [playlist, setPlaylist] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const { playlist } = await getDetail({ id: listId })
      setPlaylist(playlist)
    }

    fetchData()
  }, [listId])
  
  const columns = [
    {
      title: '标题',
      dataIndex: 'al',
      key: 'al',
      render: (al) => {
        return (
          <>
            {al.picUrl && <img style={{ width: '50px', height: '50px' }} src={al.picUrl} alt={al.name}/>}
            <PlayCircleOutlined style={{ margin: '0 10px'}}/>
            <span>{al.name}</span>
          </>
        )
      }
    },
    {
      title: '时长',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '歌手',
      dataIndex: 'ar',
      key: 'ar',
      render: (ar) => {
        const text = ar.reduce((acc, cur) => {
          return acc += cur.name + '/'
        }, '')
        return (
          text.slice(0, -1)
        )
      }
    }
  ]

  return (
    <div>
      <div className='right-head'>
        <img src={playlist.coverImgUrl} alt={playlist.description}/>
        <div>
          <h2>{playlist.name}</h2>
          <div></div>
          <div className='btn-group'>
            <Button type='primary' icon={<PlayCircleOutlined />}>播放</Button>
            <Button icon={<FolderAddOutlined />}>({playlist.subscribedCount})</Button>
            <Button icon={<ShareAltOutlined />}>({playlist.shareCount})</Button>
            <Button icon={<DownloadOutlined />}>
              下载
            </Button>
            <Button icon={<MessageOutlined />}>({playlist.commentCount})</Button>
          </div>
        </div>
      </div>
      <div className='right-song__list'>
        <div className='song-list__head'>
          <div className='song-list__head-left'>
            <span>歌曲列表</span>
            <span>{playlist?.tracks?.length}首歌</span>
          </div>
          <div className='song-list__head-right'>
            播放：
            <span>{playlist.playCount}</span>
            次
          </div>
        </div>
        {/* 默认key字段名为'key'，如果不是，则要设置rowKey指明字段名 */}
        <Table dataSource={playlist?.tracks} columns={columns} rowKey='id'/>
      </div>
    </div>
  )
}


const CommentList = () => {
  const { listId } = useContext(IdContext)
  const [commentList, setCommentList] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [hotComments, setHotComments] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        id: listId,
        type: 2, // 歌单
        pageNo: page,
        pageSize: pageSize,
        // sortType: 2 // 按热度排序，99按推荐排序 3按时间排序
      }
      const res = await Promise.all([getCommentNew({ ...params, sortType: 2}), getCommentNew({ ...params, sortType: 3})])
      const { data: { comments, totalCount } } = res[1]
      setCommentList(comments)
      setTotal(totalCount)
      const hc = res[0].data.comments
      setHotComments(hc)
    }

    fetchData()
  }, [listId, page, pageSize])

  /**
   * @param {Number} page 改变后的页码
   * @param {Number} pageSize 每页条数
   */
  function pageChange(page, pageSize) {
    setPage(page)
    setPageSize(pageSize)
  }

  return (
    <div>
      <div className='song-list__head'>
        <div className='song-list__head-left'>
          <span>评论</span>
          <span>共{total}条评论</span>
        </div>
      </div>
      <div className='do-comment'>
        {/* <img src="" alt=""/> */}
        <SmileOutlined />
        <div className='do-comment__right'>
          <div className='textarea-container'>
            <textarea rows="5" placeholder='评论'></textarea>
          </div>
          <div className='btn-groups'>
            <div>
              <SmileOutlined style={{ marginRight: '10px'}}/>
              <TrademarkOutlined />
            </div>
            <div>
              <span style={{ marginRight: '10px'}}>140</span>
              <Button type='primary'>评论</Button>
            </div>
          </div>
        </div>
      </div>
      <CommentItem title='精彩评论' comments={hotComments} />
      <CommentItem title='最新评论' total={total} comments={commentList} />
      <Pagination style={{ textAlign: 'right' }} pageSize={pageSize} total={total} onChange={pageChange}/>
    </div>
  )
}

const CommentItem = React.memo((props) => {
  return (
    <div>
      {
        props.total ? <div>{props.title}({props.total})</div> : <div>{props.title}</div>
      }
      <ul style={{ paddingLeft: 0 }}>
        {
          props.comments.map(item => {
            return (
              <li className='do-comment' key={item.commentId}>
                <img src={item.user?.avatarUrl} alt='用户头像'/>
                <div className='do-comment__right'>
                  <div>
                    <span style={{ color: '#0c73c2' }}>{item.user?.nickname}: </span>
                    <span>{item.content}</span>
                  </div>
                  {
                    item.beReplied?.length > 0 && (
                      <div className='be-replied'>
                        <span style={{ color: '#0c73c2' }}>{item.beReplied[0].user.nickname}: </span>
                        <span>{item.beReplied[0].content}</span>
                      </div>
                    )
                  }
                  <div className='btn-groups'>
                    <div>
                      <span>{new Date(item.time).toLocaleString()}</span>
                    </div>
                    <div>
                      <LikeOutlined />
                      {item.likedCount > 0 && (<span>{item.likedCount}</span>)}
                      <span className='reply-btn'>回复</span>
                    </div>
                  </div>
                </div>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
})


function Toplist() {
  const { search } = useLocation()
  const obj = {}
  search.slice(1).split('&').forEach(item => {
    let s = item.split('=')
    obj[s[0]] = s[1]
  })
  if(!obj.hasOwnProperty('id')) {
    obj.id = '19723756' // TODO: 等后面上状态管理库的时候把这个全局的状态赋值给它，目前通过nav menu打开排行榜的时候会拿不到id Ever@2021/01/11
  }
  const [listId, setListId] = useState(obj.id)

  return (
    <div className='toplist-container'>
      <IdContext.Provider value={{ listId: listId }}>
        {/* 要用useState的方法来更改listId，才会触发子组件的更新 */}
        <ToplistLeft idChange={setListId} />
        <div className='toplist-right'>
          <ToplistRight />
          <CommentList />
        </div>
      </IdContext.Provider>
    </div>
  )
}

export default Toplist