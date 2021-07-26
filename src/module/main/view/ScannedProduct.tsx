import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  SectionList,
  Alert
} from 'react-native'
import {
  styleSheetCreate,
  style,
  ImageRepository,
  windowWidth,
  Color,
  fonts,
  styleSheetFlatten,
  COLORS
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { connectStore } from 'app/system/store/connectStore'
import { IApplicationState } from 'app/system/store/applicationState'
import { ThunkDispatch } from 'redux-thunk'
import { MainActions, MainAsynсActions } from '../store'
import { flatMap, isEmpty } from 'lodash'
import { getUniqueId } from 'react-native-device-info'
import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html'
import { StackNavigationProp } from '@react-navigation/stack'
import { ListPages } from 'app/system/navigation'
import { ModalSuccessSuggestResearch } from 'app/module/global/view/ModalSuccessSuggestResearch'

interface IStateProps extends IIsLoadingAddError {
  scannedProducts: any
  errorMessage: string
  isInternetReachable: boolean | null
}

interface IDispatchProps {
  deleteAllScannedProduct(): void
  getSuggestResearch(data: IGetSuggestResearchRequest): Promise<void>
  getProductInScan(data: IGetProductInScanRequest): Promise<void>
  getProductResearch(data: IGetProductResearchRequest): Promise<void>
  getProductsBarcode(data: any): Promise<void>
  removeError(): void
}


interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {
  isModalShow: boolean
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    scannedProducts: state.main.scannedProducts,
    errorMessage: state.main.errorMessage,
    isInternetReachable: state.network.isInternetReachable,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    deleteAllScannedProduct() {
      dispatch(MainActions.deleteAllScannedProduct())
    },
    async getSuggestResearch(data) {
      await dispatch(MainAsynсActions.getSuggestResearch(data))
    },
    async getProductInScan(data) {
      await dispatch(MainAsynсActions.getProductInScan(data))
    },
    async getProductResearch(data) {
      await dispatch(MainAsynсActions.getProductResearch(data))
    },
    async getProductsBarcode(data) {
      await dispatch(MainAsynсActions.getProductsBarcode(data))
    },
    removeError() {
      dispatch(MainActions.removeError())
    },
  })
)
export class ScannedProduct extends PureComponent<IProps & IDispatchProps & IStateProps, IState>  {

  state = {
    isModalShow: false,
  }

  recognizeEverythingHandler = async (): Promise<void> => {
    const barcodes = flatMap(this.props.scannedProducts.map(((item: any) => item.data)))
      .filter((item: any) => item.STATE === 'NOT_RECOGNIZED')
      .map((item: any) => item.BARCODE)
    await this.props.getProductsBarcode({ barcodes })
  }

  deleteAllHandler = (): void => {
    this.props.deleteAllScannedProduct()
  }

  recognizedHandler = async (item: any): Promise<void> => {
    await this.props.getProductInScan({
      ...item,
    })
  }

  suggestResearchHandler = async (barcode: number): Promise<void> => {
    if (this.props.isInternetReachable) {
      const deviceId = await getUniqueId()
      await this.props.getSuggestResearch({
        device_id: deviceId,
        barcode,
      })
  
      if (!this.props.error) {
        this.setState({ isModalShow: true }, this.props.removeError)
      } else {
        setTimeout(() => {
          Alert.alert('Ошибка', this.props.errorMessage || 'Данный товар уже предлагался на исследование',
            [
              {
                text: 'Ok',
                onPress: () => this.props.removeError()
              }
            ],
            { cancelable: false })
        }, 400)
      }
    } else {
      Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
    }
  } 

  goToResearchHandler = async (id: string): Promise<void> => {
    await this.props.getProductResearch({
      id,
    })
    const { routes } = this.props.navigation.dangerouslyGetState()
    if (routes[routes.length - 1].name !== ListPages.LocalResearch) {
      this.props.navigation.push(ListPages.LocalResearch)
    }
  }

  renderSectionHeader = ({ section }: { section: any }) => {
    return (
      <Text style={styles.sectionTitle}>
        {section.title}
      </Text>
    )
  }

  renderListFooterComponent = (): JSX.Element => {
    return (
      <View style={styles.devider} />
    )
  }

  closeModalHandler = (): void => {
    this.setState({ isModalShow: false })
  }

  renderItem = ({ item }: any) => {
    const card = styleSheetFlatten([
      styles.card,
      {
        //@ts-ignore
        backgroundColor: item.RESULT ? COLORS[item.RESULT] : undefined
      }
    ])

    return (
      <TouchableOpacity
        key={Math.random().toString()}
        style={card}
        disabled={item.STATE}
        onPress={this.goToResearchHandler.bind(this, item.ID)}
      >
        <FastImage
          style={item.isLandscapeOrientation ? styles.cardLandscapeImage : styles.cardImage}
          source={{ uri: item.IMAGE && item.IMAGE.SRC }}
        />
        <View style={styles.openQualityContainer}>
          {
            !item.STATE
              ? (
                <HTML
                  baseFontStyle={styles.cardText}
                  html={`<p>${item.NAME}</p>`}
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
              )
              : null
          }
          {
            item.STATE === 'NOT_RECOGNIZED'
              ? (
                <TouchableOpacity
                  onPress={this.recognizedHandler.bind(this, { ...item })}
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
              : item.STATE === "SUGGEST_RESEARCH"
                ?
                (
                  <TouchableOpacity
                    onPress={this.suggestResearchHandler.bind(this, item.BARCODE)}
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
            item.SITES
              ? (
                <TouchableOpacity style={styles.openQualityContainer}>
                  <Text style={styles.openQualityText}>
                    {item.SITES}
                  </Text>
                </TouchableOpacity>
              )
              : null
          }
        </View>
      </TouchableOpacity>
    )
  }

  keyExtactor = (): string => Math.random().toString()

  render(): JSX.Element {

    console.log(this.props.scannedProducts)
    const scannedProductsWithoutuplicates = this.props.scannedProducts.map((topItem: any) => {
      let existinId: Array<string> = []
      const newData = topItem.data.filter((item: any) => {
        if (item.STATE === 'SUGGEST_RESEARCH' && !existinId.includes(item.BARCODE)) {
          existinId = [...existinId, item.BARCODE]
          return true
        } else if (item.STATE === 'SUGGEST_RESEARCH' && existinId.includes(item.BARCODE)) {
          return false
        } else if (!existinId.includes(item.ID)) {
          existinId = [...existinId, item.ID]
          return true
        } else if (existinId.includes(item.ID)) {
          return false
        }
      })

      return {
        title: topItem.title,
        data: newData,
      }
    })
      .filter(item => !isEmpty(item.data))
      console.log(scannedProductsWithoutuplicates)


    return (
      <View style={styles.mainContainer}>
        <Header />
        <ModalSuccessSuggestResearch
          isModalShow={this.state.isModalShow}
          closeModalHandler={this.closeModalHandler}
        />

        <View style={styles.container}>
          {
            !isEmpty(scannedProductsWithoutuplicates)
              ? (
                <View style={{ height: '100%' }}>
                  <View style={styles.header}>
                    <TouchableOpacity
                      style={styles.recognizeEverything}
                      onPress={this.recognizeEverythingHandler}
                    >
                      <Image
                        source={ImageRepository.scanProductRecognize}
                        style={styles.recognizeEverythingImage}
                      />
                      <Text style={styles.recognizeEverythingText}>
                        Распознать все
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteAll}
                      onPress={this.deleteAllHandler}
                    >
                      <Image
                        source={ImageRepository.deleteAll}
                        style={styles.deleteAllImage}
                      />
                      <Text style={styles.deleteAllText}>
                        Удалить все
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <SectionList
                    bounces={false}
                    sections={scannedProductsWithoutuplicates}
                    renderItem={this.renderItem}
                    contentContainerStyle={styles.section}
                    keyExtractor={this.keyExtactor}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={this.renderSectionHeader}
                    renderSectionFooter={this.renderListFooterComponent}
                  />
                </View>
              )
              : (
                <View style={styles.noData}>
                  <Text style={styles.noDataText}>
                    Пусто
                  </Text>
                </View>
              )
          }
        </View>
      </View>
    )
  }
}
const styles = styleSheetCreate({
  mainContainer: style.view({
    backgroundColor: Color.white,
    flex: 1,
  }),
  container: style.view({
    flex: 1,
  }),
  header: style.view({
    flexDirection: 'row',
    marginTop: windowWidth * 0.044,
    paddingHorizontal: windowWidth * 0.027,
    justifyContent: 'space-between',
    marginBottom: windowWidth * 0.05,
    // alignItems: 'center',
  }),
  recognizeEverything: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: windowWidth * 0.14,
    backgroundColor: Color.green,
  }),
  recognizeEverythingImage: style.image({
    width: windowWidth * 0.062,
    height: windowWidth * 0.05,
    marginRight: windowWidth * 0.03,
  }),
  recognizeEverythingText: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.white,
  }),
  deleteAll: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
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
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.pigment,
  }),
  noData: style.view({
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }),
  noDataText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
  }),
  devider: style.view({
    backgroundColor: Color.silverSand,
    height: windowWidth * 0.002,
    // marginBottom: windowWidth * 0.1,
  }),
  section: style.view({
    // flex: 1,
  }),
  sectionTitle: style.text({
    textAlign: 'center',
    marginVertical: windowWidth * 0.03,
    color: Color.chineseBlack,
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
  }),
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
  cardLandscapeImage: style.image({
    height: '100%',
    width: windowWidth * 0.2,
    marginRight: windowWidth * 0.04,
    backgroundColor: 'red',
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