import React, { PureComponent } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  windowWidth,
  Color,
  fonts,
  ImageRepository,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { CommonInput } from 'app/module/global/view'
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SearchLoader } from 'app/module/global/view/SearchLoader'
import { Card } from 'app/module/global/view/Card'
import { connectStore } from 'app/system/store/connectStore'
import { IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainActions, MainAsynсActions } from '../store'
import { isEmpty } from 'lodash'
import { ListPages } from 'app/system/navigation/listPages'
import { StackNavigationProp } from '@react-navigation/stack'

interface IStateProps extends IIsLoadingAddError {
  searchProductByName: any
  isRequestDone: boolean
  isInternetReachable: boolean | null
}

interface IDispatchProps {
  getProductByName(data: IGetProductByNameRequest): Promise<void>
  makeRequestSetFalse(): void
  getProductResearch(data: IGetProductResearchRequest): Promise<void>
}

interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {
  search: string
  hideLoading: boolean
  product: IGetProductByNameRequest[]
  currentPage: number
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    searchProductByName: state.main.searchProductByName,
    isRequestDone: state.main.isRequestDone,
    isInternetReachable: state.network.isInternetReachable,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    async getProductByName(data) {
      await dispatch(MainAsynсActions.getProductByName(data))
    },
    makeRequestSetFalse() {
      dispatch(MainActions.makeRequestSetFalse())
    },
    async getProductResearch(data) {
      await dispatch(MainAsynсActions.getProductResearch(data))
    },
  })
)
export class SearchProduct extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  state = {
    search: '',
    hideLoading: false,
    product: [],
    currentPage: 0,
  }

  componentDidMount() {
    this.props.makeRequestSetFalse()
  }

  onChangeSearchHandler = (search: string): void => {
    if (this.props.isRequestDone) {
      this.setState({ search }, () => this.props.makeRequestSetFalse())
    }
    this.setState({search })
    this.setState((state) => {state.search })
    this.searchHandler(search)
  }

  searchHandler = async (search:any): Promise<void> => {
    if (this.props.isInternetReachable) {
      await this.props.getProductByName({
        nameProduct: search,
      })
      if (this.props.isRequestDone && !isEmpty(this.props.searchProductByName)) {
        if (this.props.searchProductByName.lenght <= 20) {
          this.setState({ product: this.props.searchProductByName })
        } else {
          this.setState({ product: this.props.searchProductByName.slice(0, 20) })
        }
      }
    } else {
      Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
    }
  }

  goToResearchHandler = async (id: string): Promise<void> => {
    this.setState({ hideLoading: true })
    await this.props.getProductResearch({
      id,
    })
    this.setState({ hideLoading: false })
    const { routes } = this.props.navigation.dangerouslyGetState()
    if (routes[routes.length - 1].name !== ListPages.LocalResearch) {
      this.props.navigation.push(ListPages.LocalResearch)
    }
  }

  onEndReached = (): void => {
    this.setState(
      { 
        currentPage: this.state.currentPage + 1,
        product: this.props.searchProductByName.slice(0, (this.state.currentPage + 1) * 20)
      }
    )
  }

  renderItem = ({ item }: { item: any }) => {
    return (
      <Card
        imageUri={item.IMAGE && item.IMAGE.SRC}
        text={item.NAME}
        state={item.RESULT}
        nameSite={item.SITES}
        onPressHandler={this.goToResearchHandler.bind(this, item.ID)}
      />
    )
  }

  renderListFooterComponent = (): JSX.Element => {
    return (
      <View style={styles.devider} />
    )
  }

  keyExtactor = (): string => Math.random().toString()

  render(): JSX.Element {
    return (
      <View style={styles.mainContainer}>
        <Header />
        <View style={styles.container}>
          <Text style={styles.title}>
            Поиск товара по названию
          </Text>
          <View style={styles.search}>
            <CommonInput
              value={this.state.search}
              onChangeText={this.onChangeSearchHandler}
              placeholder="Введите название"
              placeholderTextColor={Color.chineseBlack}
              onPressSearchHandler={this.searchHandler}
              disabledButton={!this.state.search}
            />
          </View>
          <SearchLoader
            isLoading={this.props.isLoading && !this.state.hideLoading}
            text="Поиск товара по базе"
          />
          <View style={styles.productContainer}>
            {
              this.props.isRequestDone && !isEmpty(this.state.product) && !this.props.error
                  ? (
                      <FlatList
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtactor}
                        data={this.state.product}
                        bounces={false}
                        onEndReachedThreshold={0.5}
                        onEndReached={this.onEndReached}
                        ListFooterComponent={this.renderListFooterComponent}
                      />
                  )
                  : !this.props.isLoading && this.props.error && !isEmpty(this.state.product)
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
        </View>
      </View>
    )
  }
}

const styles = styleSheetCreate({
  mainContainer: style.view({
    flex: 1, 
    backgroundColor: Color.white,
  }),
  container: style.view({
    backgroundColor: Color.white,
    flex: 1,
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
  productContainer: style.view({
    alignItems: 'center', 
    flex: 1, 
  }),
  noData: style.view({
    alignItems: 'center',
    justifyContent: 'center',  
    flex: 1,
  }),
  noDataText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    marginBottom: windowWidth * 0.3,
  }),
  devider: style.view({
    backgroundColor: Color.silverSand,
    height: windowWidth * 0.002,
    marginBottom: windowWidth * 0.05,
  })
})