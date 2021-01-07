import http from '../utils/service'

/**
 * 热门歌手
 */
export function getTopArtist() {
  return http.request({
    url: '/top/artists',
    method: 'get'
  })
}

/**
 * 歌手分类列表
 */
export function getArtistList(params) {
  return http.request({
    url: '/artist/list',
    method: 'get',
    params
  })
}