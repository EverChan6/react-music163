import http from '../utils/service'

// 获取歌曲详情
export function getDetail(params) {
  return http.request({
    url: '/song/detail',
    method: 'get',
    params
  })
}

// 获取歌词
export function getLyric(params) {
  return http.request({
    url: '/lyric',
    method: 'get',
    params
  })
}