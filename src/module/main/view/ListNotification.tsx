import React, { PureComponent } from 'react'
import {
  View,
  Text,
  FlatList,
  Alert,
  Linking,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  Color,
  fonts,
  windowWidth,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { connectStore } from 'app/system/store/connectStore'
import { IApplicationState } from 'app/system/store/applicationState'
import { isEmpty } from 'lodash'
import Hyperlink from 'react-native-hyperlink'

interface IStateProps extends IIsLoadingAddError {
  listNotification: INotification[]
}

interface IDispatchProps {

}

interface IProps {

}

interface IState {

}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    listNotification: state.main.listNotification,
  }),
  undefined,
)
export class ListNotification extends PureComponent<IProps & IDispatchProps & IStateProps, IState> {

  state = {

  }

  componentDidMount(): void {

  }

  openUrlHandler = async (url: string): Promise<void> => {
    try {
      await Linking.openURL(url)
    } catch {
      Alert.alert('Ошибка', 'Проверьте наличие почтового клинета')
    }
    
  }

  renderItem = (data: any): JSX.Element => {
    const { item, index } = data
    return (
      <View style={index % 2 === 0 ? styles.evenСard : styles.oddСard}>
        <Text style={styles.cardDate}>
          {item.date}
        </Text>
        {/* <Hyperlink linkStyle={styles.hyperLink} onPress={this.openUrlHandler.bind(this)}> */}
          <Text style={styles.cardTitle}>
            {item.title}
          </Text>
        {/* </Hyperlink> */}
        <Hyperlink linkStyle={styles.hyperLink} onPress={this.openUrlHandler.bind(this)}>
          <Text style={styles.cardDescription}>
            {item.body}
          </Text>
        </Hyperlink>
      </View>
    )
  }

  keyExtractor = (): string => Math.random().toString()

  render(): JSX.Element {

    return (
      <View style={styles.container}>
        <Header hideNotificationCount />
        <Text style={styles.title}>
          Уведомления
       </Text>
        {
          !isEmpty(this.props.listNotification)
            ? (
              <FlatList
                data={this.props.listNotification}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
                ListFooterComponent={<View style={styles.cardFooterDevider} />}
                bounces={false}
                showsVerticalScrollIndicator={false}
              />
            )
            : (
              <View style={styles.noData}>
                <Text style={styles.noDataText}>
                  Нет уведомлений
                </Text>
              </View>
            )
        }
      </View>
    )
  }
}
const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
    backgroundColor: Color.white,
  }),
  title: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.044,
    textAlign: 'center',
    marginVertical: windowWidth * 0.05,
  }),
  evenСard: style.view({
    paddingHorizontal: windowWidth * 0.03,
    paddingVertical: windowWidth * 0.044,
    backgroundColor: Color.aliceBlue,
    borderTopColor: Color.silverSand,
    borderTopWidth: windowWidth * 0.002,
  }),
  oddСard: style.view({
    paddingHorizontal: windowWidth * 0.03,
    paddingVertical: windowWidth * 0.044,
    backgroundColor: Color.white,
    borderTopColor: Color.silverSand,
    borderTopWidth: windowWidth * 0.002,
  }),
  cardDate: style.text({
    fontSize: windowWidth * 0.032,
    color: Color.manatee,
    fontFamily: fonts.openSansSemiBold,
    marginBottom: windowWidth * 0.01,
  }),
  cardTitle: style.text({
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    fontFamily: fonts.openSansSemiBold,
    marginBottom: windowWidth * 0.02,
  }),
  cardDescription: style.text({
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
    fontFamily: fonts.openSansRegular,
    marginBottom: windowWidth * 0.02,
  }),
  cardFooterDevider: style.view({
    backgroundColor: Color.silverSand,
    height: windowWidth * 0.002,
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
  hyperLink: style.text({
    color: Color.cyanCornflowerBlue,
    fontFamily: fonts.openSansRegular,
  }),
})