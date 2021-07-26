import React, { Fragment, PureComponent } from 'react'
import { View, Text, Animated } from 'react-native'
import {
  styleSheetCreate,
  style,
  ImageRepository,
  windowWidth,
  styleSheetFlatten,
  fonts,
  Color,
  platform,
} from 'app/system/helpers'
import Video from 'react-native-video'

interface IProps {
  isLoading: boolean
  text: string
}

interface IState {
  isShowLoader: boolean
}

export class SearchLoader extends PureComponent<IProps, IState> {

  state = {
    animatedValue: new Animated.Value(0),
    isShowLoader: false,
  }

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.animatedValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      })
    )
      .start()
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.isLoading && !prevProps.isLoading) {
      this.setState({ isShowLoader: true })
    } else if (!this.props.isLoading && prevProps.isLoading) {
      this.setState({ isShowLoader: false })
    }
  }

  render(): JSX.Element {

    const loader = styleSheetFlatten([
      styles.loader,
      {
        transform: [{
          rotateZ: this.state.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          }),
        }]
      }
    ])

    return (
      <Fragment>
        {
          this.state.isShowLoader
            ? (
              <View style={styles.container}>
                <View >
                  <Video 
                    controls={false}
                    repeat
                    resizeMode="contain"
                    source={require('../../../../assets/images/loader.mov')}
                    style={styles.loader} />
                  <View style={styles.loaderSplash} />

                  <View />
                </View>
                {/* <Animated.Image
                source={ImageRepository.seachLoader}
                style={loader}
                resizeMode="center"
              /> */}
                <Text style={styles.text}>
                  {this.props.text}
                </Text>
              </View>
            )
            : null
        }
      </Fragment>
    )
  }
}
const styles = styleSheetCreate({
  container: style.view({
    // flex: 1,
    alignItems: 'center',
  }),
  loader: style.image({
    width: windowWidth * 0.16,
    height: windowWidth * 0.16,
    marginBottom: windowWidth * 0.03,
  }),
  loaderSplash: style.view({
    width: windowWidth * 0.16,
    height: windowWidth * 0.04,
    bottom: 0,
    zIndex: 9999,
    position: 'absolute',
    backgroundColor: Color.white,
  }),
  text: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.spanishBlue,
    fontSize: windowWidth * 0.037,
  }),
})