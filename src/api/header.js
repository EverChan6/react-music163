import http from '../utils/service'

// 搜索建议
export function searchSuggest(params) {
  return http.request({
    url: '/search/suggest',
    method: 'get',
    params
  })
}