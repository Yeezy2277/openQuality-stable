import React, { Fragment, PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity, 
  Image,
  Alert,
  ScrollView,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  Color,
  windowWidth,
  fonts,
  ImageRepository,
} from 'app/system/helpers'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Header } from 'app/module/global/view/Header'
import { CommonInput } from 'app/module/global/view'
import { StackNavigationProp } from '@react-navigation/stack'
import { ListPages } from 'app/system/navigation'
import { connectStore, IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainAsynсActions } from '../store/mainAsyncActions'
import { SearchLoader } from 'app/module/global/view/SearchLoader'
import { isEmpty } from 'lodash'
import FastImage from 'react-native-fast-image'
import { MainActions } from '../store'

interface IStateProps extends IIsLoadingAddError {
  manufacturerByIin: any
  researchManufacturer: any
  isRequestDone: boolean
  isInternetReachable: boolean | null
}

interface IDispatchProps {
  getManufacturerByIIN(data: IGetManufacturerByIINRequest): Promise<void>
  getResearchManufacturer(data: IGetResearchManufacturerRequest): Promise<void>
  makeRequestSetFalse(): void
}

interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {
  search: string
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    manufacturerByIin: state.main.manufacturerByIin,
    researchManufacturer: state.main.researchManufacturer,
    isRequestDone: state.main.isRequestDone,
    isInternetReachable: state.network.isInternetReachable,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    async getManufacturerByIIN(data) {
      await dispatch(MainAsynсActions.getManufacturerByIIN(data))
    },
    async getResearchManufacturer(data) {
      await dispatch(MainAsynсActions.getResearchManufacturer(data))
    },
    makeRequestSetFalse() {
      dispatch(MainActions.makeRequestSetFalse())
    },
  })
)
export class SearchManufacturer extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  state = {
    search: '',
  }

  componentDidMount(): void {
    this.props.makeRequestSetFalse()
  }

  onChangeSearchHandler = (search: string): void => {
    if (this.props.isRequestDone) {
      this.setState({ search }, () => this.props.makeRequestSetFalse())
    }
    this.setState({ search })
  }

  searchHandler = async (): Promise<void> => {
    if (this.props.isInternetReachable) {
    await this.props.getManufacturerByIIN({
      iin: this.state.search,
    })
  } else {
    Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
  }
  }

  goToResearchHandler = async (item: any): Promise<void> => {
      await this.props.getResearchManufacturer({
        idManufacturer: item.ID,
      })
      if (!isEmpty(this.props.researchManufacturer) && !this.props.error) {
        this.props.navigation.navigate(
          ListPages.ResultResearch,
          { manufacturer: item }
        )
      } else {
        Alert.alert('Ошибка', 'Не найдено исследований товара')
      }
  }

  render(): JSX.Element {
    return (
      <Fragment>
        <Header />
        <KeyboardAwareScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
           Поиск организации
          </Text>
          <View style={styles.search}>
            <CommonInput
              value={this.state.search}
              onChangeText={this.onChangeSearchHandler}
              placeholder="Введите ИНН"
              placeholderTextColor={Color.chineseBlack}
              onPressSearchHandler={this.searchHandler}
              disabledButton={!this.state.search}
              keyboardType="number-pad"
            />
          </View>
          <SearchLoader
            isLoading={this.props.isLoading}
            text="Поиск товара по базе"
          />
          <View style={{ alignItems: 'center' }}>
            {
              !this.props.isRequestDone && !this.props.isLoading
                ? (
                  <TouchableOpacity
                    onPress={this.searchHandler}
                    style={styles.searchButton}
                    disabled={!this.state.search}
                  >
                    <Image
                      source={ImageRepository.whiteSearch}
                      style={styles.searchButtonImage}
                    />
                    <Text style={styles.searchButtonText}>
                      Найти
                    </Text>
                  </TouchableOpacity>
                )
                : this.props.isRequestDone && !isEmpty(this.props.manufacturerByIin)
                  ? (
                    <ScrollView
                      bounces={false}
                      showsVerticalScrollIndicator={false}
                    >
                      {
                        this.props.manufacturerByIin.map((item: any) => {
                          return (
                            <View
                              key={Math.random().toString()}
                              style={styles.manufacturerCard}
                            >
                              <FastImage
                                source={{ uri: item.IMAGE.SRC }}
                                style={styles.manufacturerImage}
                              />
                              <View style={styles.manufacturerContainer}>
                                <Text>
                                <Text style={styles.manufacturerTitle}>
                                  Юридический адрес: {" "}
                                </Text>
                                <Text style={styles.manufacturerText}>
                                  {item.ADDRESS}
                                </Text>
                                </Text>
                                <Text>
                                <Text style={styles.manufacturerTitle}>
                                  ИНН: {" "}
                                </Text>
                                <Text style={styles.manufacturerText}>
                                  {item.INN}
                                </Text>
                                </Text>
                                <Text>
                                <Text style={styles.manufacturerTitle}>
                                  Телефон: {" "}
                                </Text>
                                <Text style={styles.manufacturerText}>
                                  {item.PHONE}
                                </Text>
                                </Text>
                                <Text>
                                <Text style={styles.manufacturerTitle}>
                                  E-mail:: {" "}
                                </Text>
                                <Text style={styles.manufacturerText}>
                                  {item.EMAIL}
                                </Text>
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={this.goToResearchHandler.bind(this, item)}
                                style={styles.researchСompanyProducts}
                              >
                                <Text style={styles.researchСompanyProductsText}>
                                  Исследование товаров компании
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )
                        })
                      }
                    </ScrollView>
                  )
                  : !this.props.isLoading
                    ? (
                      <View style={styles.noData}>
                        <Text style={styles.noDataText}>
                          Ничего не найдено
                        </Text>
                      </View>
                    )
                    : null
            }
          </View>
        </KeyboardAwareScrollView>
      </Fragment>
    )
  }
}

const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
    backgroundColor: Color.white,
  }),
  search: style.view({
    paddingHorizontal: windowWidth * 0.07,
    width: '100%',
    marginBottom: windowWidth * 0.2,
  }),
  title: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.044,
    textAlign: 'center',
    marginVertical: windowWidth * 0.05,
  }),
  searchButton: style.view({
    width: windowWidth * 0.4,
    height: windowWidth * 0.14,
    backgroundColor: Color.spanishBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.fauxAntiFlashWhite,
    flexDirection: 'row',
  }),
  searchButtonText: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.white,
    fontSize: windowWidth * 0.037,
  }),
  searchButtonImage: style.image({
    width: windowWidth * 0.057,
    height: windowWidth * 0.057,
    marginRight: windowWidth * 0.03,
  }),
  manufacturerCard: style.view({
    alignItems: 'center',
  }),
  manufacturerImage: style.image({
    width: windowWidth * 0.75,
    height: windowWidth * 0.33,
    marginBottom: windowWidth * 0.08,
  }),
  manufacturerContainer: style.view({
    width: windowWidth * 0.75,
    marginBottom: windowWidth * 0.07,
  }),
  manufacturerTitle: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
  }),
  manufacturerText: style.text({
    width: windowWidth * 0.6,
    fontFamily: fonts.openSansRegular,
    fontSize: windowWidth * 0.037,
    textAlign: 'center',
  }),
  researchСompanyProducts: style.view({
    backgroundColor: Color.spanishBlue,
    width: windowWidth * 0.75,
    height: windowWidth * 0.13,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  researchСompanyProductsText: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.white,
  }),
  noData: style.view({
    height: '100%',
    justifyContent: 'center',
  }),
  noDataText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
  })
})