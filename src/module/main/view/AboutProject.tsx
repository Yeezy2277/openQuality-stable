import React, { Fragment, PureComponent } from 'react'
import { View, Text, ScrollView } from 'react-native'
import {
  styleSheetCreate,
  style,
  Color,
  fonts,
  windowWidth,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'

interface IProps {

}

interface IState {

}

export class AboutProject extends PureComponent<IProps, IState> {

  state = {

  }

  render(): JSX.Element {
    return (
      <Fragment>
        <Header />
        <View style={styles.mainContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.container}
            bounces={false}
          >
            <Text style={styles.title}>
              О проекте
            </Text>
            <Text style={styles.subTitle}>
              Информационно-аналитический портал «Открытое качество» — некоммерческий проект, реализуемый Министерством торговли и услуг Республики Башкортостан, в целях создания системы общественного контроля за соблюдением прав потребителей на приобретение качественных и безопасных товаров (работ, услуг), реализуемых на потребительском рынке Республики Башкортостан.
            </Text>
            <Text style={styles.subTitle}>
              Проект осуществляется в рамках реализации подпрограммы «Качество товаров (работ, услуг) на потребительском рынке Республики Башкортостан» Государственной программы «О защите прав потребителей в Республике Башкортостан» (утверждена постановлением Правительства Республики Башкортостан от 24 марта 2017 года № 107, действует с 1 января 2018 года), финансируется за счет средств республиканского бюджета, не сотрудничает со спонсорами и не занимается рекламой.
            </Text>
          </ScrollView>
        </View>
      </Fragment>
    )
  }
}

const styles = styleSheetCreate({
  mainContainer: style.view({
    flex: 1,
    backgroundColor: Color.white,
  }),
  container: style.view({
    paddingHorizontal: windowWidth * 0.03,
  }),
  title: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.044,
    textAlign: 'center',
    marginVertical: windowWidth * 0.05,
  }),
  subTitle: style.text({
    fontFamily: fonts.openSansRegular,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.037,
    marginBottom: windowWidth * 0.1,
  })
})