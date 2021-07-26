import React, { PureComponent } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import {
  styleSheetCreate,
  style,
  windowWidth,
  Color,
  fonts,
  styleSheetFlatten,
  COLORS,
} from 'app/system/helpers'
import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html'

interface IStateProps extends IIsLoadingAddError {

}

interface IDispatchProps {

}

interface IProps {
  nameSite: string
  text: string
  imageUri: string
  state: string
  onPressHandler(): void
  id: string
}

interface IState {

}

export class Card extends PureComponent<IProps & IDispatchProps & IStateProps, IState>  {

  state = {

  }

  render(): JSX.Element {

    const card = styleSheetFlatten([
      styles.card,
      {
        //@ts-ignore
        backgroundColor: !this.props.state ? undefined : COLORS[this.props.state]
      }
    ])

    return (
      <TouchableOpacity
        key={Math.random().toString()}
        style={card}
        onPress={this.props.onPressHandler.bind(this, this.props.id)}
      >
        <FastImage
          style={styles.cardImage}
          source={{ uri: this.props.imageUri }}
        />
        <View style={styles.openQualityContainer}>
          <HTML
            baseFontStyle={styles.cardText}
            html={`<p>${this.props.text}</p>`}
            renderers={{
              p: (_, children) => (
                <Text
                  style={styles.cardText}
                  numberOfLines={4}
                  key={Math.random().toString()}
                >
                  {children}
                </Text>
              )
            }}
          />
          {
            this.props.nameSite
              ? (
                <TouchableOpacity style={styles.openQualityContainer}>
                  <Text style={styles.openQualityText}>
                    {this.props.nameSite}
                  </Text>
                </TouchableOpacity>
              )
              : null
          }
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = styleSheetCreate({
  card: style.view({
    width: '100%',
    height: windowWidth * 0.32,
    paddingHorizontal: windowWidth * 0.04,
    paddingVertical: windowWidth * 0.02,
    flexDirection: 'row',
    borderTopColor: Color.silverSand,
    borderTopWidth: windowWidth * 0.002,
    backgroundColor: 'red',
  }),
  cardImage: style.image({
    height: '100%',
    width: windowWidth * 0.2,
    marginRight: windowWidth * 0.04,
    backgroundColor: "transparent",

  }),
  openQualityContainer: style.view({
    width: '75%',
  }),
  openQuality: style.view({

  }),
  openQualityText: style.text({
    color: Color.spanishBlue,
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansRegular,
  }),
  cardText: style.text({
    fontFamily: fonts.openSansRegular,
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    width: '100%',
    height: '75%',
  }),
  recognize: style.view({
    width: windowWidth * 0.37,
    height: windowWidth * 0.13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowWidth * 0.0035,
    borderColor: Color.spanishBlue,
    marginBottom: windowWidth * 0.055,
    marginTop: windowWidth * 0.02,
    flexDirection: 'row',
  }),
  recognizeImage: style.view({
    width: windowWidth * 0.062,
    height: windowWidth * 0.05,
    marginRight: windowWidth * 0.027,
  }),
  research: style.view({
    width: windowWidth * 0.68,
    height: windowWidth * 0.13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowWidth * 0.0035,
    borderColor: Color.spanishBlue,
    marginBottom: windowWidth * 0.055,
    marginTop: windowWidth * 0.02,
    flexDirection: 'row',
  }),
  researchImage: style.view({
    width: windowWidth * 0.062,
    height: windowWidth * 0.05,
    marginRight: windowWidth * 0.027,
  }),
  buttonText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    color: Color.spanishBlue,
  }),

})