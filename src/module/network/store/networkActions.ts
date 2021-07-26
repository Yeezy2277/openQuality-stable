import { actionCreator } from 'app/system/store/actionCreator'

export class NetworkActions {
  static setNetworkState = actionCreator<boolean>('NETWORK/SET_NETWORK_STATE')
}