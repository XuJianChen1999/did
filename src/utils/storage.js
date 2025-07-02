import { isObject, isArray } from './type'

export function setStorage(key, value, type = 'localStorage') {
  if (!key) return
  if (isObject(value) || isArray(value)) {
    value = JSON.stringify(value)
  }

  window[type].setItem(key, value)
}

export function getStorage(key, type = 'localStorage', initValue = null) {
  if (!key) return
  let data = window[type].getItem(key)
  try {
    return JSON.parse(data)
  } catch (error) {
    // console.error(error)
    return data || initValue
  }
}

export function removeItem(key, type = 'localStorage') {
  if (!key) return
  window[type].removeItem(key)
}

export function clearStorage(type = 'localStorage') {
  window[type].clear()
}
