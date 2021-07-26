export const isObjectEmpty = (object: Object): boolean => {
  return Object.keys(object).length === 0
  && object.constructor === Object
}

export const isArrayEmpty = (array: Array<any>): boolean => {
  return Array.isArray(array) && !!array.length
}

export const compareArrays = (first: Array<any>, second: Array<any>) => {
  return JSON.stringify(first) === JSON.stringify(second)
}