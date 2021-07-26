import React, { PureComponent } from 'react'
import {
  ImageURISource,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ImageStyle,
  Linking,
  Alert,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  ImageRepository,
  Color,
  windowWidth,
  fonts,
  styleSheetFlatten,
} from 'app/system/helpers'
import { StackNavigationProp } from '@react-navigation/stack'
import { Header } from 'app/module/global/view/Header'
import { ListPages } from 'app/system/navigation'
//@ts-ignore
import OneSignal from 'react-native-onesignal'
import { connectStore, IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainActions, MainAsynсActions } from '../store'
import moment from 'moment'

interface IStateProps extends IIsLoadingAddError {
  listNotification: any
  dateInstallation: number | null
}

interface IDispatchProps {
  writeNotification(data: any): void
  resettingSomeData(): void
  getListNofification(): Promise<void>
  setDataInstallation(): void
}

interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {

}

interface IItemsMenu {
  name: string
  imagePath: ImageURISource
  style: ImageStyle
  routeName: string
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    listNotification: state.main.listNotification,
    dateInstallation: state.main.dateInstallation,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    writeNotification(data) {
      dispatch(MainActions.writeNotification(data))
    },
    resettingSomeData() {
      dispatch(MainActions.resettingSomeData())
    },
    async getListNofification() {
      await dispatch(MainAsynсActions.getListNofification())
    },
    setDataInstallation() {
      dispatch(MainActions.setDataInstallation())
    },
  })
)
export class Main extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  constructor(props: any) {
    super(props)
  }

  state = {

  }

  async componentDidMount(): Promise<void> {
    this.props.resettingSomeData()
    if (!this.props.dateInstallation) {
      this.props.setDataInstallation()
    }
    await this.props.getListNofification()
  
  }

  goToScreenHadnler = async (route: string): Promise<void> => {
    if (route) {
      switch (route) {
        case ListPages.Tastings:
          try {
            await Linking.openURL('https://kachestvorb.ru/degustatsiya/')
          } catch {
            Alert.alert('Ошибка', 'Проверьте наличие браузера')
          }
          break
        case ListPages.Research:
          try {
            await Linking.openURL('https://kachestvorb.ru/catalog/')
          } catch {
            Alert.alert('Ошибка', 'Проверьте наличие браузера')
          }
          break
        default:
          const { routes } = this.props.navigation.dangerouslyGetState()
          if (routes[routes.length - 1].name !== route) {
            this.props.navigation.push(route)
          }
      }
    }
  }

  renderItem = (data: any): JSX.Element => {
    const { item, index } = data

    const cardWithBorderLeft = styleSheetFlatten([
      styles.cardWrapper,
      index % 2 === 0 ? styles.cardWithBorderLeft : null
    ])

    return (
      <View style={cardWithBorderLeft}>
        <TouchableOpacity
          style={styles.card}
          onPress={this.goToScreenHadnler.bind(this, item.routeName)}
        >
          <Image
            source={item.imagePath}
            style={item.style}
            resizeMode="contain"
          />
          <Text style={styles.cardText}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  keyExtractor = (): string => Math.random().toString()

  render(): JSX.Element {

    return (
      <View style={styles.container}>
        <Header hideBackButton />
        <FlatList
          data={itemsMenu}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
          numColumns={2}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
    backgroundColor: Color.white,
  }),
  cardWrapper: style.view({
    width: windowWidth * 0.5,
    height: windowWidth * 0.39,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Color.silverSand,
    borderBottomWidth: windowWidth * 0.002,
  }),
  cardWithBorderLeft: style.view({
    borderRightColor: Color.silverSand,
    borderRightWidth: windowWidth * 0.002,
  }),
  card: style.view({
    alignItems: 'center',
  }),
  cardText: style.text({
    fontSize: windowWidth * 0.036,
    fontFamily: fonts.openSansRegular,
    textAlign: 'center',
    color: Color.chineseBlack,
  }),
  cardAboutLaboratoryImage: style.image({
    width: windowWidth * 0.278,
    height: windowWidth * 0.13,
    marginBottom: windowWidth * 0.03,
  }),
  cardAboutProjectImage: style.image({
    width: windowWidth * 0.115,
    height: windowWidth * 0.115,
    marginBottom: windowWidth * 0.035,
  }),
  cardResearchImage: style.image({
    width: windowWidth * 0.11,
    height: windowWidth * 0.14,
    marginBottom: windowWidth * 0.03,
  }),
  cardScannedProductImage: style.image({
    width: windowWidth * 0.3,
    height: windowWidth * 0.15,
    marginBottom: windowWidth * 0.03,
  }),
  cardScanProductImage: style.image({
    width: windowWidth * 0.16,
    height: windowWidth * 0.13,
    marginBottom: windowWidth * 0.03,
  }),
  cardSearchManufacturerImage: style.image({
    width: windowWidth * 0.3,
    height: windowWidth * 0.125,
    marginBottom: windowWidth * 0.035,
  }),
  cardSearchNameProductImage: style.image({
    width: windowWidth * 0.3,
    height: windowWidth * 0.13,
    marginBottom: windowWidth * 0.03,
  }),
  cardTastingsImage: style.image({
    width: windowWidth * 0.12,
    height: windowWidth * 0.13,
    marginBottom: windowWidth * 0.041,
  }),
})

const itemsMenu: IItemsMenu[] = [
  {
    name: 'Сканирование\nтоваров',
    imagePath: ImageRepository.mainScanProduct,
    style: styles.cardScanProductImage,
    routeName: ListPages.ScanProduct,
  },
  {
    name: 'Отсканированые\n товары',
    imagePath: ImageRepository.mainScannedProduct,
    style: styles.cardScannedProductImage,
    routeName: ListPages.ScannedProduct,
  },
  {
    name: 'Поиск товара по\n названию',
    imagePath: ImageRepository.mainSearchNameProduct,
    style: styles.cardSearchNameProductImage,
    routeName: ListPages.SearchProduct,
  },
  {
    name: 'Поиск производителя\n по ИНН',
    imagePath: ImageRepository.mainSearchManufacturer,
    style: styles.cardSearchManufacturerImage,
    routeName: ListPages.SearchManufacturer,
  },
  {
    name: 'О проекте',
    imagePath: ImageRepository.mainAboutProject,
    style: styles.cardAboutProjectImage,
    routeName: ListPages.AboutProject,
  },
  {
    name: 'О лаборатории',
    imagePath: ImageRepository.mainAboutLaboratory,
    style: styles.cardAboutLaboratoryImage,
    routeName: ListPages.AboutLaboratory,
  },
  {
    name: 'Исследования',
    imagePath: ImageRepository.mainResearch,
    style: styles.cardResearchImage,
    routeName: ListPages.Research,
  },
  {
    name: 'Дегустации',
    imagePath: ImageRepository.mainTastings,
    style: styles.cardTastingsImage,
    routeName: ListPages.Tastings,
  },
]
