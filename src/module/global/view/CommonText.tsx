import React, { PureComponent } from 'react'
import { Text, TextProps } from 'react-native'
import {
  styleSheetCreate,
  style,
} from 'app/system/helpers'

interface IProps extends TextProps {

}

interface IState {

}

export class CommonText extends PureComponent<IProps,IState>{
  render() {
    return (
      <Text style={styles.text}>

      </Text>
    )
  }
}

const styles = styleSheetCreate({
  text: style.text({

  }),
})
