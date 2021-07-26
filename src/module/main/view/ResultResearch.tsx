import React, { PureComponent } from 'react'
import { View, Text, FlatList } from 'react-native'
import { styleSheetCreate, style, windowWidth, fonts, Color, } from 'app/system/helpers'
import { RouteProp } from '@react-navigation/native'
import { Header } from 'app/module/global/view/Header'
import { Title } from 'app/module/global/view/Title'
import { Card } from 'app/module/global/view/Card'
import FastImage from 'react-native-fast-image'
import { connectStore, IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainAsynсActions } from '../store'
import { StackNavigationProp } from '@react-navigation/stack'
import { ListPages } from 'app/system/navigation'

interface IStateProps extends IIsLoadingAddError {
  // products: IGetProductResponce[]
  // searchProductByName: any
  researchManufacturer: any

}

interface IDispatchProps {
  getProductResearch(data: IGetProductResearchRequest): Promise<void>
}

interface IProps {
  route: RouteProp<any, any>
  navigation: StackNavigationProp<any>
}

interface IState {
  hideLoading: boolean
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    researchManufacturer: state.main.researchManufacturer,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    async getProductResearch(data) {
      await dispatch(MainAsynсActions.getProductResearch(data))
    },
  })
)
export class ResultResearch extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  state = {
    hideLoading: false,
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

  renderItem = ({ item }: { item: any }) => {
    return (
      <Card
        imageUri={item.IMAGE && item.IMAGE.SRC}
        text={item.NAME}
        onPressHandler={this.goToResearchHandler.bind(this, item.ID)}
        state={item.RESULT}
        nameSite={item.SITES}
      />
    )
  }

  keyExtactor = (): string => Math.random().toString()

  render(): JSX.Element {

    const { manufacturer } = this.props.route.params
    // console.log('CC', this.props.researchManufacturer)

    return (
      <View style={styles.container}>
        <Header />
        <Title
          isHTMLTitle
          title={manufacturer.NAME}
        />
        <View style={styles.header}>
          <FastImage
            style={styles.manufacturerImage}
            source={{ uri: manufacturer.IMAGE.SRC }}
          />
          <Text style={styles.researchGoods}>
            Исследование товаров:
          </Text>
        </View>
        <FlatList
          renderItem={this.renderItem}
          keyExtractor={this.keyExtactor}
          data={this.props.researchManufacturer}
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
  header: style.view({
    alignItems: 'center',
  }),
  logo: style.view({
    width: windowWidth * 0.75,
    height: windowWidth * 0.33,
    marginBottom: windowWidth * 0.08,
  }),
  researchGoods: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    marginBottom: windowWidth * 0.05,
  }),
  manufacturerImage: style.image({
    width: windowWidth * 0.75,
    height: windowWidth * 0.33,
    marginBottom: windowWidth * 0.08,
    // borderWidth: windowWidth * 0.0025,
    // borderColor: Color.spanishBlue,
    marginTop: windowWidth * 0.05,
  }),
})