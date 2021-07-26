import React, { Fragment, PureComponent } from 'react'
import {
  View,
  Text,
  TextInput,
  Alert,
  Linking,
  TouchableOpacity
} from 'react-native'
import {
  styleSheetCreate,
  style,
  Color,
  windowWidth,
  fonts,
  styleSheetFlatten,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Hyperlink from 'react-native-hyperlink'

interface IProps {

}

interface IState {
  formText: string
}

export class Help extends PureComponent<IProps, IState> {

  state = {
    formText: '',
  }

  onChangeFormTextHandler = (formText: string): void => {
    this.setState({ formText })
  }

  openWebSiteHandler = async (data): Promise<void> => {
    console.log('data', data)
  }

  onSubmitFormHandler = async (): Promise<void> => {
    try {
      // await Linking.openURL(`mailto:support@kachestvorb.ru&body=${this.state.formText}`)
      await Linking.openURL(`mailto:support@kachestvorb.ru?subject=&body=${this.state.formText}`)

    } catch {
      Alert.alert('Ошибка', 'Проверьте наличие почтового клинета')
    }
  }

  render(): JSX.Element {

    const sendButton = styleSheetFlatten([
      styles.sendButton,
      {
        backgroundColor: this.state.formText ? Color.spanishBlue : Color.ashGray
      }
    ])

    return (
      <Fragment>
        <Header />
        <View style={styles.container}>
          <KeyboardAwareScrollView>
            <Text style={styles.nameApplication}>
              Открытое качество
            </Text>
            <Text style={styles.versionApplication}>
              Версия приложения: 1.0
            </Text>
            <Text
              selectable
              style={styles.contactEmail}
            >
              Контактный e-mail: support@kachestvorb.ru
            </Text>
            <Hyperlink
              linkDefault={true}
              linkStyle={styles.informationAboutCopyrightLink}
            >
              <Text style={styles.informationAboutCopyright}>
                Информация о правообладателе: Министерство торговли и услуг Республики Башкортостан, https://trade.bashkortostan.ru/about/

            </Text>
            </Hyperlink>
            <TextInput
              multiline={true}
              numberOfLines={4}
              value={this.state.formText}
              onChangeText={this.onChangeFormTextHandler}
              style={styles.form}
              placeholder="Введите сообщение"
            />
            <TouchableOpacity
              style={sendButton}
              onPress={this.onSubmitFormHandler}
              disabled={!this.state.formText}
            >
              <Text style={styles.sendButtonText}>
                Отправить
              </Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        </View>
      </Fragment>
    )
  }
}
const styles = styleSheetCreate({
  container: style.view({
    flex: 1,
    backgroundColor: Color.white,
    paddingHorizontal: windowWidth * 0.04,
    paddingTop: windowWidth * 0.04,
  }),
  nameApplication: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.048,
    textAlign: 'center',
    marginBottom: windowWidth * 0.03,
  }),
  versionApplication: style.text({
    fontSize: windowWidth * 0.039,
    // textAlign: 'center',
    marginBottom: windowWidth * 0.03,
    fontFamily: fonts.openSansRegular,
  }),
  contactEmail: style.text({
    fontSize: windowWidth * 0.039,
    // textAlign: 'center',
    marginBottom: windowWidth * 0.03,
    fontFamily: fonts.openSansRegular,
  }),
  form: style.text({
    width: '100%',
    height: windowWidth * 0.4,
    paddingBottom: windowWidth * 0.03,
    paddingLeft: windowWidth * 0.04,
    paddingRight: windowWidth * 0.08,
    paddingTop: windowWidth * 0.03,
    fontFamily: fonts.openSansItalic,
    borderColor: Color.spanishBlue,
    borderWidth: windowWidth * 0.0025,
    color: Color.eerieBlack,
    borderRadius: windowWidth * 0.04,
    marginBottom: windowWidth * 0.03,
  }),
  informationAboutCopyright: style.text({
    fontSize: windowWidth * 0.039,
    marginBottom: windowWidth * 0.03,
    fontFamily: fonts.openSansRegular,
  }),
  informationAboutCopyrightLink: style.text({
    fontSize: windowWidth * 0.039,
    color: Color.spanishBlue,
    fontFamily: fonts.openSansRegular,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationColor: Color.spanishBlue,
  }),
  sendButton: style.view({
    width: '100%',
    height: windowWidth * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.fauxAntiFlashWhite,
    flexDirection: 'row',
    borderRadius: windowWidth * 0.04,
  }),
  sendButtonText: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.aliceBlue,
  })
})