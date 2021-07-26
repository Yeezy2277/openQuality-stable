import { ThunkDispatch } from 'redux-thunk'
import NefInfo from "@react-native-community/netinfo"
// import { systemActions } from 'app/shared/store/system'
import { PureComponent } from 'react'
import { connectStore, IApplicationState } from 'app/system/store'
import { NetworkActions } from 'app/module/network/store'

interface IProps {

}

interface IState {

}

interface IDispatchProps {
  setNetworkStatus(status: boolean): void
}

interface IStateProps {

}

@connectStore(
  null,
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
     setNetworkStatus(status: boolean): void {
       dispatch(NetworkActions.setNetworkState(status))
    },
  })
)
export class NetworkObserver extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  componentDidMount(): void {
    // @ts-ignore
    NefInfo.addEventListener(this.onChangeNetworkStatus)
  }

  onChangeNetworkStatus = ({ isInternetReachable }: any): void => {
    this.props.setNetworkStatus(isInternetReachable)
  }

  render(): null {
    return null
  }
}
