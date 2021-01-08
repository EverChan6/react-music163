import http from "../utils/service";

/**
 * 首页轮播图
 * @param {Object} type 资源类型 0：pc 1: android 2: iphone 4: ipad
 */
export function getBanner(type) {
  return http.request({
    url: '/banner',
    method: 'get',
    params: type
  })
}

/**
 * 推荐歌单
 * @param {Object} limit 取出数量
 */
export function getRecommend(limit) {
  return http.request({
    url: '/personalized',
    method: 'get',
    params: limit
  })
}

/**
 * 新碟上架
 * @param {Object} params 
 */
export function getAlbum(params) {
  return http.request({
    url: '/top/album',
    method: 'get',
    params
  })
}

/**
 * 所有榜单
 * @param {Object} params 
 */
export function getTopList() {
  return http.request({
    url: '/toplist',
    method: 'get'
  })
}

/**
 * 歌单分类
 */
export function getCatList() {
  return http.request({
    url: '/playlist/catlist',
    method: 'get'
  })
}

/**
 * 热门歌单分类
 */
export function getHotRecommend() {
  return http.request({
    url: '/playlist/hot',
    method: 'get'
  })
}

/**
 * 歌单 ( 网友精选碟 )
 */
export function getPlayList(params) {
  return http.request({
    url: '/top/playlist',
    method: 'get',
    params
  })
}