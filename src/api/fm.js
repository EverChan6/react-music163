import http from '../utils/service'

/**
 * 电台 - 分类
 */
export function getList() {
  return http.request({
    url: '/dj/catelist',
    method: 'get'
  })
}

/**
 * 电台 - 推荐
 */
export function getRecommend() {
  return http.request({
    url: '/program/recommend',
    method: 'get'
  })
}

/**
 * 电台 - 节目榜
 */
export function getPToplist(params) {
  return http.request({
    url: '/dj/program/toplist',
    method: 'get',
    params
  })
}

/**
 * 热门电台
 */
export function getHot() {
  return http.request({
    url: '/dj/hot',
    method: 'get'
  })
}

/**
 * 电台 - 推荐类型
 */
export function getCatRecommend() {
  return http.request({
    url: '/dj/category/recommend',
    method: 'get'
  })
}

