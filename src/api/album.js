import http from '../utils/service'

// 热门新碟(最新专辑)
export function getNewestAlbum() {
  return http.request({
    url: '/album/newest',
    method: 'get'
  })
}

// 全部新碟
export function getNewAlbum(params) {
  return http.request({
    url: '/album/new',
    method: 'get',
    params
  })
}

// 专辑评论
export function getCommentOfAlbum(params) {
  return http.request({
    url: '/comment/album',
    method: 'get',
    params
  })
}