import React, { useEffect } from 'react'
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  windowWidth,
  Color,
  ImageRepository,
  styleSheetFlatten,
  isIphoneX,
  fonts,
  platform,
} from 'app/system/helpers'
import { useNavigation } from '@react-navigation/native'
import { ListPages } from 'app/system/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { IApplicationState } from 'app/system/store'
import { isEmpty } from 'lodash'
import { MainActions } from 'app/module/main/store'

interface IProps {
  hideBackButton?: boolean
  hideNotificationCount?: boolean
}

export const Header = (props: IProps) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  
  const listNotification = useSelector((state: IApplicationState) => state.main.listNotification)

  const countUnread = isEmpty(listNotification) 
  ? 0
  : listNotification.reduce((accumulator: number, item: any) => {
    if (!item.isRead) {
      return accumulator + 1
    } else {
      return accumulator
    }
  }, 0)

  useEffect(() => {
    if (countUnread && props.hideNotificationCount) {
      dispatch(MainActions.makeNotificationRead())
    }
  }, [listNotification])

  const goBackHandler = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const goToMainHandler = () => {
      //@ts-ignore
    navigation.replace(ListPages.Main)
  }


  const goToNotificationHandler = () => {
    navigation.navigate(ListPages.ListNotification)
  }

  const goToInformationHandler = () => {
    navigation.navigate(ListPages.Help)
  }

  // const openDrawerHandler = () => {
  //   navigation.navigate(ListPages.Help)
  // }

  const container = styleSheetFlatten([
    styles.container,
    {
      height: isIphoneX()
        ? windowWidth * 0.24
        : platform.isIos
          ? windowWidth * 0.20
          : windowWidth * 0.15
    }
  ])

  return (
    <View style={container}>
      <View style={styles.wrapper}>
        <TouchableOpacity 
          disabled={props.hideBackButton} 
          onPress={goToMainHandler}
        >
          <Image
            source={ImageRepository.headerLogo}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <View style={styles.controlButton}>
          {
            !props.hideBackButton
              ? (
                <TouchableOpacity
                  style={styles.goBackContainer}
                  onPress={goBackHandler}
                >
                  <Image
                    source={ImageRepository.headerArrowGoback}
                    style={styles.arrowGoBack}
                  />
                  <Text style={styles.goBack}>
                    Назад
                </Text>
                </TouchableOpacity>
              )
              : null
          }
          <TouchableOpacity
            onPress={goToNotificationHandler}
          >
            <Image
              source={ImageRepository.headerNotification}
              style={styles.nofitication}
            />
            {
              countUnread !== 0 && !props.hideNotificationCount
                ? (
                  <View style={styles.nofiticationCount}>
                  <Text style={styles.nofiticationCountText}>
                    {countUnread}
                  </Text>
                </View>
                )
                : null
            }
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goToInformationHandler}
          >
            <Image
              source={ImageRepository.headerInformation}
              style={styles.information}
            />
          </TouchableOpacity>
          {/*<TouchableOpacity*/}
          {/*  onPress={openDrawerHandler}*/}
          {/*>*/}
          {/*  <Image*/}
          {/*    source={ImageRepository.headerMenu}*/}
          {/*    style={styles.openDrawer}*/}
          {/*  />*/}
          {/*</TouchableOpacity>*/}
        </View>
      </View>
    </View>
  )
}


const styles = styleSheetCreate({
  container: style.view({
    width: windowWidth,
    backgroundColor: Color.fauxAntiFlashWhite,
    paddingHorizontal: windowWidth * 0.03,
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }),
  wrapper: style.view({
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  }),
  isPhoneXBlock: style.view({
    height: windowWidth * 0.1,
    backgroundColor: Color.fauxAntiFlashWhite,
    width: windowWidth,
  }),
  logo: style.view({
    width: windowWidth * 0.26,
    height: windowWidth * 0.12,
    marginBottom: windowWidth * 0.015,
  }),
  controlButton: style.view({
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: '50%',
  }),
  goBackContainer: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: windowWidth * 0.056,
  }),
  arrowGoBack: style.image({
    width: windowWidth * 0.02,
    height: windowWidth * 0.04,
  }),
  goBack: style.text({
    fontSize: windowWidth * 0.047,
    marginLeft: windowWidth * 0.035,
    fontFamily: fonts.exo2Regular
  }),
  nofiticationContainer: style.view({

  }),
  nofitication: style.image({
    width: windowWidth * 0.052,
    height: windowWidth * 0.057,
    marginRight: windowWidth * 0.05,
  }),
  nofiticationCount: style.view({
    width: windowWidth * 0.04,
    height: windowWidth * 0.04,
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.pigment,
    borderRadius: windowWidth * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -windowWidth * 0.01,
    left: windowWidth * 0.03,
    backgroundColor: Color.white,
  }),
  nofiticationCountText: style.text({
    fontSize: windowWidth * 0.055,
    fontFamily: fonts.exo2Regular,
  }),
  information: style.view({
    width: windowWidth * 0.07,
    height: windowWidth * 0.07,
    marginRight: windowWidth * 0.05,
  }),
  openDrawer: style.image({
    width: windowWidth * 0.082,
    height: windowWidth * 0.062,
  })

})