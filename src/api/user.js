import http from '../utils/service'

/**
 * 获取用户详情
 */
export function getUserDetail(params) {
  return http.request({
    url: '/user/detail',
    method: 'get',
    params
  })
}

/**
 * 获取用户歌单
 */
export function getUserPlaylist(params) {
  return http.request({
    url: '/user/playlist',
    method: 'get',
    params
  })
}


/**
 * 获取用户播放记录
 */
export function getUserRecord(params) {
  return http.request({
    url: '/user/record',
    method: 'get',
    params
  })
}


/**
 * 获取用户动态
 */
 export function getUserEvent(params) {
  return http.request({
    url: '/user/event',
    method: 'get',
    params
  })
}

/**
 * 获取动态评论
 */
 export function getCommentOfEvent(params) {
  return http.request({
    url: '/comment/event',
    method: 'get',
    params
  })
}

/**
 * 获取视频播放地址
 */
 export function getVideo(params) {
  return http.request({
    url: '/video/url',
    method: 'get',
    params
  })
}

/**
 * 获取用户关注列表
 */
 export function getFollows(params) {
  return http.request({
    url: '/user/follows',
    method: 'get',
    params
  })
}