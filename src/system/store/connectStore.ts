import { connect } from 'react-redux'
import { IApplicationState } from 'app/system/store'
import { Dispatch } from 'redux'

export const connectStore = <StateProps, DispatchProps>(
  mapStateToProps?: ((state: IApplicationState, ownProps: any) => StateProps) | null,
  mapDispatchToProps?: (dispatch: Dispatch, ownProps: any) => DispatchProps): any => {
  return connect(mapStateToProps, mapDispatchToProps as any) as any
}