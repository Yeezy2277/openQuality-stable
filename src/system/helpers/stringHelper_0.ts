export class StringHelper {

  static iosPathResolver = (path: string): string => {
    return path.replace('file://', '')
  }

  static findLastMatchTakeSubstring = (string: string, searchString: string) => {
    return string.substring(string.lastIndexOf(searchString) + 1)
  }

  static search = (value: string, searchValue: string) => {
    return value.toLowerCase().includes(searchValue.toLowerCase())
  }
  
  static isLocalImage = (checkedString: string): boolean => {
    return checkedString.startsWith('file:')
  }
  
}