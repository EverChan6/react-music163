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

// 歌曲评论
export function getComment(params) {
  return http.request({
    url: '/comment/music',
    method: 'get',
    params
  })
}

// 获取相似音乐
export function getSimiSong(params) {
  return http.request({
    url: '/simi/song',
    method: 'get',
    params
  })
}