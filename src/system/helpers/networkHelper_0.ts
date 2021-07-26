import { PureComponent } from 'react'
import { Alert } from 'react-native'
import { useSelector } from 'react-redux'
import { IApplicationState } from '../store'


export const helperInternetReachable = (): boolean => {
  const isInternetReachable = useSelector((state: IApplicationState) => state.network.isInternetReachable)
  if (!isInternetReachable) {
    Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
    return false
  }
  return true
}