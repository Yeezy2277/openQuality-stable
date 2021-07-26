import React, { PureComponent } from 'react'
import { 
  Text,
  TouchableOpacity, 
  TouchableOpacityProps, 
} from 'react-native'
import {
  styleSheetCreate,
  style,
} from 'app/system/helpers'

interface IProps extends TouchableOpacityProps {

}

interface IState {

}

export class CustomButton extends PureComponent<IProps,IState>{
  render() {
    return (
      <TouchableOpacity
        {...this.props}
        style={styles.container}
      >
        <Text>

        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = styleSheetCreate({
  container: style.view({

  }),
})

