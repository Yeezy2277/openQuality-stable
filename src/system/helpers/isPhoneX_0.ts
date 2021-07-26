import { Dimensions, Platform } from 'react-native'

export function isIphoneX() {
  const dimen = Dimensions.get('window')
  // console.log(Platform.OS)
  return (
      // Platform.OS === 'ios' &&
      //@ts-ignore
      !Platform.isPad &&
      //@ts-ignore
      !Platform.isTVOS &&
      ((dimen.height === 812 || dimen.width === 812)
        || (dimen.height === 844 || dimen.width === 844)
        || (dimen.height === 896 || dimen.width === 896)
        || (dimen.height === 926 || dimen.width === 926))
  );
}