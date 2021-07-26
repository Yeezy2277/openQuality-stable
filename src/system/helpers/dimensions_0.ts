import { Dimensions, StatusBar, } from 'react-native'
import { platform } from 'app/system/helpers/platform'

const windowDimensions = Dimensions.get('window')

export const windowWidth = windowDimensions.width;
export const windowHeight = windowDimensions.height - (!platform.isAndroid ? StatusBar.currentHeight || 0 : 0)