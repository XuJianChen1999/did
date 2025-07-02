export function getQueryParams(url = window.location.href) {
  if (!url) return
  // FIXME: ?有可能出现中文
  const queryStart = Math.max(url?.indexOf('?'), url?.indexOf('？'))

  // 如果没有问号，返回空对象
  if (queryStart === -1) {
    return {}
  }

  // 获取问号后的查询字符串
  const queryString = url?.slice(queryStart + 1)
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }

  return result
}
