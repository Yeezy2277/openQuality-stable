import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import { NetworkActions } from './networkActions'
import { INetworkState, NetworkInitialState } from './networkState'

const setNetworkState = (state: INetworkState, payload: string)=> {
  return {
    ...state,
    isInternetReachable: payload,
  }
}

export const networkReducer: ReducerBuilder<INetworkState> = reducerWithInitialState(NetworkInitialState)
  .case(NetworkActions.setNetworkState, setNetworkState)