import React, { PureComponent } from 'react'
import { 
  FlatList, 
  View, 
  Text,
  Image, 
  Alert,
  TouchableOpacity
} from 'react-native'
import { 
  styleSheetCreate,
  style, 
  windowWidth, 
  Color, 
  ImageRepository, 
  styleSheetFlatten, 
  fonts, 
  COLORS, 
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { Title } from 'app/module/global/view/Title'
import { connectStore, IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainActions, MainAsynсActions } from '../store'
import { StackNavigationProp } from '@react-navigation/stack'
import { ListPages } from 'app/system/navigation'
import { Loader } from 'app/module/global/view/Loader'
import FastImage from 'react-native-fast-image'
import HTML from 'react-native-render-html'
import { getUniqueId } from 'react-native-device-info'
import { ModalSuccessSuggestResearch } from 'app/module/global/view/ModalSuccessSuggestResearch'

interface IStateProps extends IIsLoadingAddError {
  products: IGetProductResponce[]
  errorMessage: string
  isInternetReachable: boolean | null
}

interface IDispatchProps {
  getProduct(data: IGetProductRequest): Promise<void>
  getProductResearch(data: IGetProductResearchRequest): Promise<void>
  getSuggestResearch(data: IGetSuggestResearchRequest): Promise<void>
  removeError(): void
}

interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {
  isModalShow: boolean
  isButtonDisabled: boolean
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    products: state.main.products,
    errorMessage: state.main.errorMessage,
    isInternetReachable: state.network.isInternetReachable,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    async getProduct(data) {
      await dispatch(MainAsynсActions.getProduct(data))
    },
    async getProductResearch(data) {
      await dispatch(MainAsynсActions.getProductResearch(data))
    },
    async getSuggestResearch(data) {
      await dispatch(MainAsynсActions.getSuggestResearch(data))
    },
    removeError() {
      dispatch(MainActions.removeError())
    },
  })
)
export class BarcodeSearchResults extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  state = {
    isModalShow: false,
    isButtonDisabled: false,
  }

  goToResearchHandler = async (id: string): Promise<void> => {
    await this.props.getProductResearch({
      id,
    })
   this.props.navigation.push(ListPages.LocalResearch)
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

  closeModalHandler = (): void => {
    this.setState({ isModalShow: false }, this.props.removeError)
  }

  renderItem = ({ item }: any) => {

    const card = styleSheetFlatten([
      styles.card,
      {
        //@ts-ignore
        backgroundColor: COLORS[item.RESULT]
      }
    ])

    return (
      <TouchableOpacity
        style={card}
        disabled={item.STATE}
        onPress={this.goToResearchHandler.bind(this, item.ID )}
      >
        <FastImage
          style={styles.cardImage}
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
                        key={Math.random().toString()}
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
            item.STATE === 'NOT_RECOGNIZED'
              ? (
                <TouchableOpacity
                  // onPress={this.recognizedHandler.bind(this, { ...item, title })}
                  style={styles.recognize}
                  disabled={this.props.isLoading}
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
                    disabled={this.props.isLoading}
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

  renderListFooterComponent = (): JSX.Element => {
    return (
      <View style={styles.devider} />
    )
  }

  render(): JSX.Element {

    if (this.props.isLoading) {
      return <Loader />
    }

    return (
      <View style={styles.container}>
        <Header />
        <Title title="Результаты поиска по штрихкоду" />
        <ModalSuccessSuggestResearch 
          isModalShow={this.state.isModalShow}
          closeModalHandler={this.closeModalHandler}
        />
        <FlatList
          renderItem={this.renderItem}
          keyExtractor={this.keyExtactor}
          data={this.props.products}
          contentContainerStyle={styles.flatlist}
          bounces={false}
          ListFooterComponent={this.renderListFooterComponent}
        />
        {/* <View style={styles.devider} /> */}
      </View>
    )
  }
}
const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
  }),
  devider: style.view({
    backgroundColor: Color.silverSand,
    height: windowWidth * 0.002,
    // marginBottom: windowWidth * 0.02,
  }),
  flatlist: style.view({
  
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