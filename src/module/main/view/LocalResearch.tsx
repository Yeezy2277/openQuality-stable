import React, { Fragment, PureComponent } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image
} from 'react-native'
import {
  styleSheetCreate,
  style,
  windowWidth,
  Color,
  fonts, ImageRepository,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { Title } from 'app/module/global/view/Title'
import { connectStore } from 'app/system/store/connectStore'
import { IApplicationState } from 'app/system/store'
import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html'

interface IStateProps extends IIsLoadingAddError {
  // products: IGetProductResponce[]
  researchProduct: any
}

interface IDispatchProps {
  // getProduct(data: IGetProductRequest): Promise<void>
}

interface IProps {

}

interface IState {

}


@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    researchProduct: state.main.researchProduct,
  }),
  undefined,
  // (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
  //   // async getProduct(data) {
  //   //   await dispatch(MainAsynсActions.getProduct(data))
  //   // },
  // })
)
export class LocalResearch extends PureComponent<IProps & IDispatchProps & IStateProps, IState>  {

  state = {

  }

  

  render(): JSX.Element {
    const { researchProduct } = this.props

    return (
      <Fragment>
        <Header />
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mainContainer}
        >
          <View>
            <Title
              isHTMLTitle
              title={researchProduct.NAME}
            />
            <FastImage
              style={styles.logo}
              source={{ uri: researchProduct.IMAGE.SRC }}
            />
            <View style={styles.researchResultsContainer}>
              <Text style={styles.researchResults}>
                Результаты исследований:
              </Text>
              <View style={researchProduct.STATUS === 'Соответствует' ? styles.matches : styles.noMatches}>
                <Text style={researchProduct.STATUS === 'Соответствует' ? styles.matchesText : styles.noMatchesText}>
                  {researchProduct.STATUS}
                </Text>
              </View>
            </View>
            <View style={styles.researchInformationContainer}>
              {
                researchProduct.PROPERTIES.map((item: any) => {
                  return (
                    <Text
                      key={Math.random().toString()}
                      style={styles.researchInformation}
                    >
                      <Text style={styles.researchInformationKey}>
                        {item.name} {":  "}
                      </Text>
                      <Text style={styles.researchInformationValue}>
                        {item.value}
                      </Text>
                    </Text>
                  )
                })
              }
            </View>
            <View style={styles.footerContainer}>
              <View style={styles.markContainer}>
            <Image
              source={ImageRepository.mark}
              style={styles.markImage}
            />
            <Text style={styles.markText}>
              9.67 балла
            </Text>
          </View>
              <HTML
                baseFontStyle={researchProduct.STATUS === 'Соответствует' ? styles.matchesDescription : styles.noMatchesDescription}
                html={`<p>${researchProduct.DETAIL_TEXT}</p>`}
                renderers={{
                  p: (_, children) => (
                    <Text style={researchProduct.STATUS === 'Соответствует' ? styles.matchesDescription : styles.noMatchesDescription}>
                      {children}
                    </Text>
                  )
                }}
              />
              {/* <View style={styles.deleteAllContainer}>
            <TouchableOpacity
              style={styles.deleteAll}
            // onPress={this.deleteAllHandler}
            >
              <Image
                source={ImageRepository.deleteAll}
                style={styles.deleteAllImage}
              />
              <Text style={styles.deleteAllText}>
                Удалить 
              </Text>
            </TouchableOpacity>
          </View> */}
            </View>
          </View>
        </ScrollView>
      </Fragment>
    )
  }
}

const styles = styleSheetCreate({
  mainContainer: style.view({
    // flex: 1,
    backgroundColor: Color.white,
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.05,
  }),
  container: style.view({
    width: windowWidth * 0.9,
  }),
  logo: style.image({
    width: windowWidth * 0.5,
    height: windowWidth * 0.6,
    marginHorizontal: windowWidth * 0.25,
  }),
  researchInformationContainer: style.view({
    width: windowWidth,
  }),
  researchInformation: style.view({
    flexDirection: 'row',
    marginBottom: windowWidth * 0.02,
    marginHorizontal: windowWidth * 0.05,

  }),
  researchInformationKey: style.text({
    color: Color.ashGray,
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.exo2Regular,
    // flexWrap: 'wrap'
  }),
  researchInformationValue: style.text({
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.exo2Regular,
  }),
  organolepticTests: style.text({
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    fontFamily: fonts.exo2Regular,
    textTransform: 'uppercase',
    marginBottom: windowWidth * 0.05,
  }),
  markContainer: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: windowWidth * 0.06,
    marginBottom: windowWidth * 0.08,
  }),
  markImage: style.image({
    width: windowWidth * 0.06,
    height: windowWidth * 0.056,
    marginRight: windowWidth * 0.02,
  }),
  markText: style.text({
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.exo2Regular,
  }),
  researchResultsContainer: style.view({
    marginTop: windowWidth * 0.08,
    marginHorizontal: windowWidth * 0.05
  }),
  researchResults: style.text({
    fontFamily: fonts.exo2Regular,
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    marginBottom: windowWidth * 0.028,
  }),
  matches: style.view({
    borderWidth: windowWidth * 0.0055,
    borderColor: Color.green,
    width: windowWidth * 0.47,
    height: windowWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: windowWidth * 0.04,
  }),
  matchesText: style.text({
    fontSize: windowWidth * 0.044,
    color: Color.green,
    textTransform: 'uppercase',
    fontFamily: fonts.exo2Regular,
  }),
  matchesDescription: style.text({
    fontSize: windowWidth * 0.026,
    color: Color.green,
    fontFamily: fonts.exo2Regular,
    marginBottom: windowWidth * 0.055,
  }),
  noMatches: style.view({
    borderWidth: windowWidth * 0.0055,
    borderColor: Color.pigment,
    width: windowWidth * 0.47,
    height: windowWidth * 0.11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: windowWidth * 0.04,
  }),
  noMatchesText: style.text({
    fontSize: windowWidth * 0.044,
    color: Color.pigment,
    textTransform: 'uppercase',
    fontFamily: fonts.exo2Regular,
  }),
  noMatchesDescription: style.text({
    fontSize: windowWidth * 0.026,
    color: Color.pigment,
    fontFamily: fonts.exo2Regular,
    marginBottom: windowWidth * 0.055,
  }),
  deleteAllContainer: style.view({
    alignItems: 'center',
    marginBottom: windowWidth * 0.07,
  }),
  deleteAll: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.62,
    height: windowWidth * 0.14,
    backgroundColor: Color.white,
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.pigment,
  }),
  deleteAllImage: style.image({
    width: windowWidth * 0.04,
    height: windowWidth * 0.057,
    marginRight: windowWidth * 0.03,
  }),
  deleteAllText: style.text({
    fontFamily: fonts.exo2Regular,
    fontSize: windowWidth * 0.037,
    color: Color.pigment,
  }),
  footerContainer: style.view({
    marginHorizontal: windowWidth * 0.05,
  })

})