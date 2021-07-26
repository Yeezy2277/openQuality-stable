import { Platform } from 'react-native'
import { EPlatformName } from './constants'

export const platform = {
  isAndroid: Platform.OS === EPlatformName.android,
  isIos: Platform.OS === EPlatformName.ios,
  version: Platform.Version,
}