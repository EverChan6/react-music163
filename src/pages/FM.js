import React, { useEffect, useState, useContext } from 'react'
import { Button, Tabs, Progress } from 'antd'
import { getList, getRecommend, getPToplist, getHot, getCatRecommend } from '../api/fm'
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import '../assets/css/fm.scss'

const { TabPane } = Tabs

const StandardContext = React.createContext(null)

const HeadList = () => {
  const [list, setList] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { categories } = await getList()
      setList(categories)
    }

    fetchData()
  }, [])
  return (
    <div className='list'>
      {
        list.map(item => (
          <div key={item.id} className='li'>
            <img src={item.picPCBlackUrl} alt={item.name}/>
            <span>{item.name}</span>
          </div>
        ))
      }
    </div>
  )
}

const HeadListt = React.memo(HeadList)

const ProgramLi = (props) => {
  const standardScore = useContext(StandardContext)
  const { item } = props

  return (
    <li className='program-item'>
      { item.rank && 
        <div className='program-item__col'>
          <span>{item.rank}</span>
          <div>
            { item.rank - item.lastRank > 0 ? <ArrowDownOutlined className='down' /> : <ArrowUpOutlined className='up'/>}
            <span className={item.rank - item.lastRank > 0 ? 'down' : 'up'}>{Math.abs(item.rank-item.lastRank)}</span>
          </div>
        </div>
      }
      <div className='program-item__row'>
        {
          item.program ? 
            <img src={item.program.coverUrl} alt={item.program.description}/>
            :
            <img src={item.coverUrl} alt={item.description}/>
        }
        
        <div className='program-item__col'>
          {
            item.program ? (
              <>
                <div className='program-name'>{item.program.name}</div>
                <span>{item.program.radio.name}</span>
              </>
            ) : (
              <>
                <div className='program-name'>{item.name}</div>
                <span>{item.radio.name}</span>
              </>
            )
          }
        </div>
      </div>
      {
        item.program ? (
          <Progress style={{width: '100px'}} percent={parseInt(item.score/standardScore * 100)} showInfo={false} />
        ) : (
          <div>{item.radio.category}</div>
        )
      }
    </li>
  )
}

const Program = (props) => {
  return (
    <Tabs style={{ flex: 1 }} tabBarExtraContent={props.operations}>
      <TabPane tab={props.tab} key={props.tabKey}>
        <ul>
          {
            props.list.length > 0 && props.list.map((item, index) => (
              <ProgramLi item={item} key={index}></ProgramLi>
            ))
          }
        </ul>
      </TabPane>
    </Tabs>
  )
}

const Programme = () => {
  const initTabs = [{
    tab: '推荐节目',
    operations: <Button type="text">更多&gt;</Button>,
    list: []
  },
  {
    tab: '节目排行榜',
    operations: <Button type="text">更多&gt;</Button>,
    list: []
  }]
  const [tabs, setTabs] = useState(initTabs)
  const [standardScore, setStandardScore] = useState(0)
  useEffect(() => {
    const fetchData = async () => {
      const [{ programs }, { toplist }] = await Promise.all([getRecommend(), getPToplist({
        limit: 10,  // 返回数量
        // offset: 1 // 偏移数量，用于分页
      })])

      setTabs([{...tabs[0], list: programs}, {...tabs[1], list: toplist}])
      setStandardScore(toplist[0].score)
    }

    fetchData()
  }, [])
  return (
    <div className="programs">
      <StandardContext.Provider value={standardScore}>
        {
          tabs.map((item, index) => (
            <Program key={index} tabKey={index} tab={item.tab} operations={item.operations} list={item.list}/>
          ))
        }
      </StandardContext.Provider>
    </div>
  )
}

const Radio = () => {
  const [tabs, setTabs] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCatRecommend()
      setTabs(data)
    }

    fetchData()
  }, [])
  return (
    <div>
      {
        tabs.map((item) => (
          <Tabs key={item.categoryId} tabBarExtraContent={<Button type="text">更多&gt;</Button>}>
            <TabPane tab={item.categoryName} key={item.categoryId} className='radio-item__container'>
              {
                item.radios.map((it, index) => (
                  <div key={index} className='radio-item__div'>
                    <img src={it.picUrl} alt={it.name}/>
                    <div>
                      <h3>{it.name}</h3>
                      <span>{it.rcmdText}</span>
                    </div>
                  </div>
                ))
              }
            </TabPane>
          </Tabs>
        ))
      }
    </div>
  )
}


const FM = () => {
  return (
    <>
      <HeadListt />
      <Programme />
      <Radio />
    </>
  )
}

export default FM