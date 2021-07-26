import { IMainState } from 'app/module/main/store'
import { INetworkState } from 'app/module/network/store'
import { ISystemState } from 'app/system/store/system'

export interface IApplicationState {
  system: ISystemState
  main: IMainState
  network: INetworkState
}
