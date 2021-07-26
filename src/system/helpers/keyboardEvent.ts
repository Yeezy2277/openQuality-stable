import { KeyboardEventName } from 'react-native'
import { platform } from './platform'

export const keyboardHideEvent: KeyboardEventName =
  platform.isIos
    ? 'keyboardWillHide'
    : 'keyboardDidHide'
export const keyboardShowEvent: KeyboardEventName =
  platform.isIos
    ? 'keyboardWillShow'
    : 'keyboardDidShow'