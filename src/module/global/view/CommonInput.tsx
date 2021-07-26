import React, { PureComponent } from 'react'
import {
   View, 
   TextInput, 
   TextInputProps, 
   Image,
   TouchableOpacity,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  ImageRepository,
  windowWidth,
  Color,
  fonts,
} from 'app/system/helpers'

interface IProps extends TextInputProps {
  onPressSearchHandler(): void
  disabledButton?: boolean
}

interface IState {

}

export class CommonInput extends PureComponent<IProps,IState>{

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          {...this.props}
          style={styles.textInput}
        />
        <TouchableOpacity
          onPress={this.props.onPressSearchHandler}
          style={styles.imageContainer}
          disabled={this.props.disabledButton}
        >
          <Image 
            source={ImageRepository.blueSearch}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = styleSheetCreate({
  container: style.view({
    width: '100%',
    height: windowWidth * 0.1,
    flexDirection: 'row',
  }),
  textInput: style.text({
    width: '100%',
    paddingBottom: windowWidth * 0.03,
    paddingLeft: windowWidth * 0.02,
    paddingRight: windowWidth * 0.08,
    fontFamily: fonts.openSansItalic,
    borderBottomColor: Color.spanishBlue,
    borderBottomWidth: windowWidth * 0.0025,
    color: Color.eerieBlack,
  }),
  imageContainer: style.view({
    position: 'absolute',
    right: windowWidth * 0.03,
    top: windowWidth * 0.02,
  }),
  image: style.image({
    width: windowWidth * 0.05,
    height: windowWidth * 0.05,
  }),
})
