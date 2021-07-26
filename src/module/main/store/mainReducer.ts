import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import { MainInitialState, IMainState } from './mainState'
import { MainAsynсActions } from './mainAsyncActions'
import { MainActions } from './mainActions'
import moment from 'moment'
import { isEmpty, flatMap } from 'lodash'
import { Alert } from 'react-native'

const getProductStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getProductDone =
  (state: IMainState, payload: any): IMainState => {

    const { result } = payload
    if (result && result.ERROR && result.ERROR.code === 404) {
      return {
        ...state,
        isLoading: false,
        error: true,
      }
    }

    return {
      ...state,
      isLoading: false,
      error: false,
      products: result,
    }
  }

const getProductInScanStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getProductInScanDone =
  (state: IMainState, { result, params }: any): IMainState => {

    let scannedProducts = [...state.scannedProducts]
    const findSection = scannedProducts.findIndex((item: any) => item.title === params.title)
    const indexProduct = scannedProducts[findSection].data.findIndex((item: any) => item.ID)

    if (result && result.ERROR && result.ERROR.code === 404) {
      scannedProducts[findSection].data[indexProduct].STATE = "SUGGEST_RESEARCH"

      return {
        ...state,
        isLoading: false,
        scannedProducts,

      }
    }

    scannedProducts[findSection].data[indexProduct] = result[0]

    return {
      ...state,
      isLoading: false,
      error: false,
      scannedProducts,
    }
  }

const getProductInScanFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getProductFailed = (state: IMainState, payload: any): IMainState => {

  if (payload && payload.error && payload.error && payload.error.code === 'ECONNABORTED') {
    Alert.alert('Ошибка интернет соединения', 'Попробуйте позже')
    return {
      ...state,
      isLoading: false,
      errorNetwork: true,
    }
  }

  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getProductResearchStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getProductResearchDone =
  (state: IMainState, { result }: any): IMainState => {

    return {
      ...state,
      isLoading: false,
      error: false,
      researchProduct: result,
    }
  }

const getProductResearchFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getManufacturerByIINStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
    isRequestDone: false,
  }
}

const getManufacturerByIINDone =
  (state: IMainState, { result }: any): IMainState => {

    if (result && result.ERROR && result.ERROR.code === 404) {
      return {
        ...state,
        isLoading: false,
        error: true,
        isRequestDone: true,
      }
    }

    return {
      ...state,
      isLoading: false,
      error: false,
      manufacturerByIin: result,
      isRequestDone: true,
    }
  }

const getManufacturerByIINFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getProductByNameStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
    isRequestDone: false,
  }
}

const getProductByNameNDone =
  (state: IMainState, { result }: any): IMainState => {

    if (result && result.ERROR && result.ERROR.code === 404) {
      return {
        ...state,
        isLoading: false,
        error: true,
        isRequestDone: true,
      }
    }
    return {
      ...state,
      isLoading: false,
      error: false,
      searchProductByName: result,
      isRequestDone: true,
    }
  }

const getProductByNameFailed = (state: IMainState, payload: any): IMainState => {

  // if (payload && payload.error && payload.error && payload.error.code === 'ECONNABORTED') {
  //   Alert.alert('Ошибка интернет соединения', 'Попробуйте позже')
  //   return {
  //     ...state,
  //     isLoading: false,
  //     errorNetwork: true,
  //   }
  // }

  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getResearchManufacturerStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getResearchManufacturerNDone =
  (state: IMainState, { result }: any): IMainState => {
    return {
      ...state,
      isLoading: false,
      error: false,
      researchManufacturer: result,
    }
  }

const getResearchManufacturerFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const writeNotification = (state: IMainState, payload: any): IMainState => {
  const listNotification = state.listNotification
  if (!listNotification.find(item => item.notificationID === payload.notificationID)) {

    return {
      ...state,
      listNotification: [payload, ...state.listNotification,]
    }
  }

  return {
    ...state
  }

}

const deleteNotification = (state: IMainState, id: string): IMainState => {
  // let listNotification = state.listNotification.filter(item => +item.id !== +id)
  return {
    ...state,
    // listNotification,
  }
}

const removeError = (state: IMainState): IMainState => {
  return {
    ...state,
    error: false,
  }
}

const makeRequestSetFalse = (state: IMainState): IMainState => {
  return {
    ...state,
    isRequestDone: false,
  }
}

const getProductWithoutLoaderStarted = (state: IMainState): IMainState => {
  return {
    ...state,
  }
}

const getProductWithoutLoaderDone =
  (state: IMainState, { result }: any): IMainState => {
    const currentData: any = moment.utc().format('DD.MM.YYYY')
    if (result && result.ERROR && result.ERROR.code === 404) {
      return {
        ...state,
      }
    }

    let scannedProducts: any = [...state.scannedProducts]

    const indexDate = scannedProducts.findIndex((item: any) => item.title === currentData)

    if (indexDate >= 0) {
      scannedProducts[indexDate].data = [...result, ...scannedProducts[indexDate].data]
    } else {
      const newScanned = {
        title: currentData,
        data: result,
      }
      scannedProducts = [newScanned, ...state.scannedProducts]
    }

    return {
      ...state,
      isLoading: false,
      error: false,
      scannedProducts,
    }
  }

const getProductWithoutLoaderFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    // isLoading: false,
    // error: true,
  }
}

const deleteAllScannedProduct = (state: IMainState): IMainState => {
  return {
    ...state,
    scannedProducts: [],
  }
}

const addLocalScannedProduct = (state: IMainState, result: any): IMainState => {
  const currentData: any = moment.utc().format('DD.MM.YYYY')

  let scannedProducts: any = [...state.scannedProducts]

  const indexDate = scannedProducts.findIndex((item: any) => item.title === currentData)

  if (indexDate >= 0) {
    scannedProducts[indexDate].data = flatMap([result, ...scannedProducts[indexDate].data])
  } else {
    const newScanned = {
      title: currentData,
      data: flatMap([result]),
    }
    scannedProducts = [newScanned, ...state.scannedProducts]
  }

  return {
    ...state,
    scannedProducts,
  }
}

const getProductsBarcodeStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getProductsBarcodeDone =
  (state: IMainState, { result, params }: any): IMainState => {

    const requestedKeys = Object.keys(result)
    let scannedProducts = [...state.scannedProducts]

    requestedKeys.map((barCode: string) => {
      scannedProducts.map((topItem: any, topIndex: number) => {
        topItem.data.map((item: any, index: number) => {
          console.log(item.BARCODE)
          if (barCode === item.BARCODE) {
            if (isEmpty(result[barCode])) {
              item.STATE = 'SUGGEST_RESEARCH'
            } else {
              scannedProducts[topIndex].data[index] = Object.values(result[barCode])[0]
            }
          }
        })
      })
    })

    return {
      ...state,
      isLoading: false,
      error: false,
      scannedProducts,
    }
  }

const getProductsBarcodeFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const getProductsBarcodeInScanStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getProductsBarcodeInScanDone =
  (state: IMainState, { result, params }: any): IMainState => {

    // const parseResult = Object.values(result)
    // if (parseResult.every(item => isEmpty(true))) {
    //   return  {
    //     ...state,
    //     isLoading: false,
    //     errorGropScan: true,
    //   }
    // }
    const currentData: any = moment.utc().format('DD.MM.YYYY')
    let products: any = []
    let scannedProducts: any = [...state.scannedProducts]

    let todayScannedProducts = scannedProducts.find((item: { title: string }) => item.title === currentData)

    params.barcodes.map((topItem: string) => {
      if (isEmpty(result[topItem])) {
        const missingProduct = todayScannedProducts.data.find((item: any) => item.BARCODE === topItem)
        products = [...products, missingProduct]
      } else {
        const qrCodes = Object.values(result[topItem])
        products = [...products, ...qrCodes]
      }
    })

    products = products.filter(item => item)

    const todayIndex = scannedProducts.findIndex((item: any) => item.title === currentData)

    params.barcodes.map((topItem: string) => {
      if (!isEmpty(result[topItem])) {
        scannedProducts[todayIndex].data.map((item: any, index: number) => {
          if (item.BARCODE === topItem) {
            scannedProducts[todayIndex].data[index] = Object.values(result[topItem])[0]
          }
        })
      }
    })

    scannedProducts = scannedProducts.filter(item => item)

    // console.log('PRODUCTS', products)

    return {
      ...state,
      isLoading: false,
      error: false,
      products,
      scannedProducts,
    }
  }

const getProductsBarcodeInScanFailed = (state: IMainState, payload: any): IMainState => {

  if (payload && payload.error && payload.error && payload.error.code === 'ECONNABORTED') {
    Alert.alert('Ошибка интернет соединения', 'Попробуйте позже')
    return {
      ...state,
      isLoading: false,
      errorNetwork: true,
    }
  }

  return {
    ...state,
    isLoading: false,
    errorGropScan: true,
  }
}

const getSuggestResearchStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: true,
    error: false,
  }
}

const getSuggestResearchDone =
  (state: IMainState, { result, params }: any): IMainState => {

    if (result && result.ERROR && result.ERROR.code === 201) {
      return {
        ...state,
        isLoading: false,
        error: true,
        errorMessage: result.ERROR.message,
      }
    }

    return {
      ...state,
      isLoading: false,
      error: false,
    }
  }

const getSuggestResearchFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: true,
  }
}

const resettingSomeData = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    error: false,
    errorMessage: '',
    isRequestDone: false,
    errorGropScan: false,
  }
}

const makeNotificationRead = (state: IMainState): IMainState => {
  return {
    ...state,
    isLoading: false,
    listNotification: state.listNotification.map(item => {
      return {
        ...item,
        isRead: true
      }
    })
  }
}

const setDataInstallation = (state: IMainState): IMainState => {
  const dateInstallation = moment().unix()
  return {
    ...state,
    dateInstallation,
  }
}

const getListNofificationStarted = (state: IMainState): IMainState => {
  return {
    ...state,
    isNotificationLoading: true,
  }
}

const getListNofificationDone =
  (state: IMainState, { result }: any): IMainState => {
    let needeedNotification: any = []

    result.map(item => {
      if ((state.dateInstallation as any) > moment(item.datetime).unix()) {
        const notification = {
          notificationID: item.id,
          date: moment(item.datetime).format('DD.MM.YYYY'),
          title: item.head_ru,
          body: item.desc_ru,
          isRead: false,
          unixTime: moment(item.datetime).unix(),
        }
        needeedNotification.push(notification)
      }
    })

    const allNotificaton = [...state.listNotification, ...needeedNotification]

    var removeDuplicatesNotification = allNotificaton.reduce((unique, o) => {
      if (!unique.some(obj => obj.notificationID === o.notificationID)) {
        unique.push(o)
      }
      return unique
    }, [])

    return {
      ...state,
      isNotificationLoading: false,
      listNotification: removeDuplicatesNotification,
    }
  }

const getListNofificationFailed = (state: IMainState): IMainState => {
  return {
    ...state,
    // isLoading: false,
    // error: true,
  }
}

export const mainReducer: ReducerBuilder<IMainState> = reducerWithInitialState(MainInitialState)
  .case(MainAsynсActions.getProduct.async.started, getProductStarted)
  .case(MainAsynсActions.getProduct.async.done, getProductDone)
  .case(MainAsynсActions.getProduct.async.failed, getProductFailed)

  .case(MainAsynсActions.getListNofification.async.started, getListNofificationStarted)
  .case(MainAsynсActions.getListNofification.async.done, getListNofificationDone)
  .case(MainAsynсActions.getListNofification.async.failed, getListNofificationFailed)

  .case(MainAsynсActions.getProductInScan.async.started, getProductInScanStarted)
  .case(MainAsynсActions.getProductInScan.async.done, getProductInScanDone)
  .case(MainAsynсActions.getProductInScan.async.failed, getProductInScanFailed)

  .case(MainAsynсActions.getProductsBarcode.async.started, getProductsBarcodeStarted)
  .case(MainAsynсActions.getProductsBarcode.async.done, getProductsBarcodeDone)
  .case(MainAsynсActions.getProductsBarcode.async.failed, getProductsBarcodeFailed)

  .case(MainAsynсActions.getProductsBarcodeInScan.async.started, getProductsBarcodeInScanStarted)
  .case(MainAsynсActions.getProductsBarcodeInScan.async.done, getProductsBarcodeInScanDone)
  .case(MainAsynсActions.getProductsBarcodeInScan.async.failed, getProductsBarcodeInScanFailed)

  .case(MainAsynсActions.getProductResearch.async.started, getProductResearchStarted)
  .case(MainAsynсActions.getProductResearch.async.done, getProductResearchDone)
  .case(MainAsynсActions.getProductResearch.async.failed, getProductResearchFailed)

  .case(MainAsynсActions.getManufacturerByIIN.async.started, getManufacturerByIINStarted)
  .case(MainAsynсActions.getManufacturerByIIN.async.done, getManufacturerByIINDone)
  .case(MainAsynсActions.getManufacturerByIIN.async.failed, getManufacturerByIINFailed)

  .case(MainAsynсActions.getProductByName.async.started, getProductByNameStarted)
  .case(MainAsynсActions.getProductByName.async.done, getProductByNameNDone)
  .case(MainAsynсActions.getProductByName.async.failed, getProductByNameFailed)

  .case(MainAsynсActions.getResearchManufacturer.async.started, getResearchManufacturerStarted)
  .case(MainAsynсActions.getResearchManufacturer.async.done, getResearchManufacturerNDone)
  .case(MainAsynсActions.getResearchManufacturer.async.failed, getResearchManufacturerFailed)

  .case(MainAsynсActions.getSuggestResearch.async.started, getSuggestResearchStarted)
  .case(MainAsynсActions.getSuggestResearch.async.done, getSuggestResearchDone)
  .case(MainAsynсActions.getSuggestResearch.async.failed, getSuggestResearchFailed)

  .case(MainActions.writeNotification, writeNotification)
  .case(MainActions.deleteNotification, deleteNotification)
  .case(MainActions.removeError, removeError)
  .case(MainActions.makeRequestSetFalse, makeRequestSetFalse)
  .case(MainActions.makeNotificationRead, makeNotificationRead)

  .case(MainAsynсActions.getProductWithoutLoader.async.started, getProductWithoutLoaderStarted)
  .case(MainAsynсActions.getProductWithoutLoader.async.done, getProductWithoutLoaderDone)
  .case(MainAsynсActions.getProductWithoutLoader.async.failed, getProductWithoutLoaderFailed)

  .case(MainActions.deleteAllScannedProduct, deleteAllScannedProduct)
  .case(MainActions.addLocalScannedProduct, addLocalScannedProduct)
  .case(MainActions.resettingSomeData, resettingSomeData)
  .case(MainActions.setDataInstallation, setDataInstallation)

