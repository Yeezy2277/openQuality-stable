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
  Color,
  fonts,
  windowWidth,
  ImageRepository,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'

interface IProps {

}

interface IState {

}

export class AboutLaboratory extends PureComponent<IProps, IState> {

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
              О лаборатории
          </Text>
            <Text style={styles.firstSubTitle}>
              Исследования проекта «Открытое качество» проводятся в ГКУ «Испытательный центр» — подведомственной структуре Министерства торговли и услуг Республики Башкортостан. Испытательный центр аккредитован в национальной системе аккредитации и соответствует требованиям ГОСТ ИСО/МЭК 17025-2009 — аттестат аккредитации № RA.RU.21АГ55. Включен в реестр лабораторий, осуществляющих оценку соответствия пищевой продукции требованиям Технических регламентов Таможенного союза.
          </Text>
            <Text style={styles.secondSubTitle}>
              В область аккредитации испытательного центра включены лабораторные испытания пищевой и алкогольной продукции, бутилированной питьевой и минеральной воды.
          </Text>
            <Image
              source={ImageRepository.aboutLaboratoryCertificate}
              style={styles.certificate}
              resizeMode="contain"
            />
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
  firstSubTitle: style.text({
    fontFamily: fonts.openSansRegular,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.037,
    marginBottom: windowWidth * 0.1,
  }),
  secondSubTitle: style.text({
    fontFamily: fonts.openSansRegular,
    color: Color.eerieBlack,
    fontSize: windowWidth * 0.037,
    marginBottom: windowWidth * 0.03,
  }),
  certificate: style.view({
    width: '100%',
    height: windowWidth * 0.68,
    marginBottom: windowWidth * 0.1,
  }),
})