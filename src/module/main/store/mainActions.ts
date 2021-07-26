import { actionCreator } from 'app/system/store/actionCreator'

export class MainActions {
  static removeError = actionCreator('MAIN/REMOVE_ERROR')
  static writeNotification = actionCreator('MAIN/WRITE_NOTIFICATION')
  static deleteNotification = actionCreator('MAIN/DELETE_NOTIFICATION')
  static makeNotificationRead = actionCreator('MAIN/MAKE_NOFICATION_READ')
  static makeRequestSetFalse = actionCreator('MAIN/MAKE_REQUEST_SET_FALSE')
  static deleteAllScannedProduct = actionCreator('MAIN/DELETE_ALL_SCANNED_PRODUCTS')
  static addLocalScannedProduct = actionCreator('MAIN/ADD_SCANNED_PRODUCTS')
  static resettingSomeData = actionCreator('MAIN/RESETTIN_SOME_DATA')
  static setDataInstallation = actionCreator('MAIN/SET_DATA_INSTALLATION')
}