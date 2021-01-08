import http from '../utils/service'

// 全部新碟
export function getNewAlbum(params) {
  return http.request({
    url: '/album/new',
    method: 'get',
    params
  })
}