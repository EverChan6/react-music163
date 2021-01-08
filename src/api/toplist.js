import http from "../utils/service";

/**
 * 获取歌单详情
 * @param {Object} params 
 */
export function getDetail(params) {
  return http.request({
    url: '/playlist/detail',
    method: 'get',
    params
  })
}

/**
 * 所有榜单内容摘要
 */
export function getSummary() {
  return http.request({
    url: '/toplist/detail',
    method: 'get'
  })
}

/**
 * 歌单评论
 * @param {Object} params 
 */
export function getComment(params) {
  return http.request({
    url: '/comment/playlist',
    method: 'get',
    params
  })
}

/**
 * 获取歌单热门评论
 * @param {Object} params 
 */
export function getHotComment(params) {
  return http.request({
    url: '/comment/hot',
    method: 'get',
    params
  })
}

/**
 * 新版评论接口
 * @param {Object} params 
 * @param {Number} params.id 资源 id, 如歌曲 id,mv id
 * @param {Number} params.type 资源类型 , 对应歌曲0 , mv1, 专辑3 , 歌单2 , 电台4, 视频5, 动态6
 */
export function getCommentNew(params) {
  return http.request({
    url: '/comment/new',
    method: 'get',
    params
  })
}