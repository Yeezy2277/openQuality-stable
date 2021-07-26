export interface INetworkState {
  isInternetReachable: boolean | null
}

export const NetworkInitialState: INetworkState = {
  isInternetReachable: null
}
