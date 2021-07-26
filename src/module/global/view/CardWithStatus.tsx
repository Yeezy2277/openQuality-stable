import React, { PureComponent } from 'react'
import { TouchableOpacity, View, Image, Text, } from 'react-native'
import { 
  styleSheetCreate, 
  style, 
  ImageRepository, 
  Color, 
  fonts, 
  windowWidth, 
  styleSheetFlatten,
 } from 'app/system/helpers'
import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html'

interface IProps {
  sites: string
  state: string
  name: string
  imageUrl: string
  id: string
}

interface IState {

}

export class CardWithStatus extends PureComponent<IProps, IState> {

  state = {

  }

  render(): JSX.Element {

    const { 
      sites, 
      state, 
      imageUrl, 
      name, 
      id,
     } = this.props

     const card = styleSheetFlatten([
      styles.card,
      {
        //@ts-ignore
        backgroundColor: !state ? undefined : COLORS[state]
      }
    ])


    return (
      <TouchableOpacity
        // key={Math.random().toString()}
        style={card}
        disabled={!state}
     //   onPress={this.goToResearchHandler.bind(this, id)}
      >
        <FastImage
          style={styles.cardImage}
          source={{ uri: imageUrl }}
        />
        <View style={styles.openQualityContainer}>
          {
            !state
              ? (
                <HTML
                  baseFontStyle={styles.cardText}
                  html={`<p>${name}</p>`}
                  renderers={{
                    p: (_, children) => (
                      <Text
                        style={styles.cardText}
                        numberOfLines={4}
                      >
                        {children}
                      </Text>
                    )
                  }}
                />
              )
              : null
          }
          {
            state === 'NOT_RECOGNIZED'
              ? (
                <TouchableOpacity
                  // onPress={this.recognizedHandler.bind(this, { ...item, title })}
                  style={styles.recognize}
                >
                  <Image
                    source={ImageRepository.mainScanProduct}
                    style={styles.recognizeImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.buttonText}>
                    Распознать
              </Text>
                </TouchableOpacity>
              )
              : state === "SUGGEST_RESEARCH"
                ?
                (
                  <TouchableOpacity
                    // onPress={this.suggestResearchHandler}
                    style={styles.research}
                  >
                    <Image
                      source={ImageRepository.scanProductSuggestResearch}
                      style={styles.researchImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.buttonText}>
                      Предложить исследование
                </Text>
                  </TouchableOpacity>
                )
                : null
          }
          {
            sites
              ? (
                <TouchableOpacity style={styles.openQualityContainer}>
                  <Text style={styles.openQualityText}>
                    {sites}
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
})