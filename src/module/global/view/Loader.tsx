import React, { PureComponent } from 'react'
import { View, Image, } from 'react-native'
import { 
  styleSheetCreate, 
  style,
  Color,
  styleSheetFlatten,
  ImageRepository,
  windowWidth,
 } from 'app/system/helpers'

interface IProps {
  isFloating?: boolean
}

interface IState {

}

export class Loader extends PureComponent<IProps, IState>{
  render() {
    const { isFloating } = this.props

    const container = styleSheetFlatten([
      styles.container,
      isFloating ? styles.floating : null
    ])

    return (
      <View style={container}>
        <Image 
          source={ImageRepository.headerLogo}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    )
  }
}

const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  image: style.image({
    width: windowWidth * 0.6,
    height: windowWidth * 0.2,
  }),
  floating: style.view({
    
  }),
})