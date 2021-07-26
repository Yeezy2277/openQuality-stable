import React, { PureComponent } from 'react'
import Orientation, { orientation } from 'react-native-orientation'

interface IProps {

}

interface IState {
  orientation: orientation | null
}

export const withOrientationListener = (WrappedComponent: any) => {
  class OrientaionListener extends PureComponent<IState, IProps>{

    state = {
      orientation: null
    }

    componentDidMount(): void {
      this.setState({ orientation: Orientation.getInitialOrientation() })
      Orientation.addOrientationListener(this.onChangeOrientaion)
    }

    componentWillUnmount(): void {
      Orientation.removeOrientationListener(this.onChangeOrientaion)
    }

    onChangeOrientaion = (orientation: orientation): void => {
      this.setState({ orientation })
    }

    render(): JSX.Element  {
      return (
        <WrappedComponent
          {...this.props}
          orientation={this.state.orientation} 
        />
      )
    }
  }

  return OrientaionListener

}