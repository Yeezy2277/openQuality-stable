import moment from 'moment'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
//@ts-ignore
import OneSignal from 'react-native-onesignal'
import { MainActions } from 'app/module/main/store'
import { Linking, Alert } from 'react-native'

interface IProps {
  onOpened(): void
}

export const NotificationService = (props: IProps) => {

  useEffect(() => {
    OneSignal.setLogLevel(6, 0)
    OneSignal.init('ba1fd3d9-df52-4d7e-95f6-11e407daf2bb', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    })
    OneSignal.inFocusDisplaying(2)
    OneSignal.requestPermissions({
      alert: true,
      badge: true,
      sound: true,
    })
    OneSignal.addEventListener('received', onReceived)
    OneSignal.addEventListener('opened', onOpened)
    OneSignal.addEventListener('ids', onIds)
  }, [])

  const dispatch = useDispatch()

  const onReceived = (data: any) => {
    const { payload } = data
    if (payload) {
      const notification: any = {
        title: payload.title,
        body: payload.body,
        notificationID: payload.notificationID,
        date: moment.utc().format('DD.MM.YYYY'),
        isRead: false,
        unixTime: moment().unix(),
      }
      dispatch(MainActions.writeNotification(notification))
    }
  }

  const onOpened = async ({ notification } : any): Promise<void> => {
    if (notification.payload) {
      const payload: any = {
        title: notification.payload.title,
        body: notification.payload.body,
        notificationID: notification.payload.notificationID,
        date: moment.utc().format('DD.MM.YYYY'),
        isRead: false,
        unixTime: moment().unix(),
      }
      dispatch(MainActions.writeNotification(payload))
      props.onOpened()
   //   const urlFind = notification.payload.title.match(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/)
      // if  (urlFind) {


      // }
    }
  }

  const onIds = async (
    device: { pushToken: string, userId: string }
  ) => {
    console.log('device', device)
    // const { mgfkey } =  this.props.userInformation
    // if (!this.props.notificationToken && device.pushToken) {
    //   await this.props.setToken({
    //     ...this.props.userLoginInformation,
    //     token: device.pushToken,
    //     mgfkey,
    //   })
    // }
  }

  return null


}
