const toString = Object.prototype.toString
const checkTypeFn = (type) => {
  return function isType(value) {
    return toString.call(value) === `[object ${type}]`
  }
}

export const isFunc = checkTypeFn('Function')
export const isUndefined = checkTypeFn('Undefined')
export const isArray = checkTypeFn('Array')
export const isString = checkTypeFn('String')
export const isObject = checkTypeFn('Object')
export const isNumber = checkTypeFn('Number')
export const isDate = checkTypeFn('Date')
export const isBoolean = checkTypeFn('Boolean')
