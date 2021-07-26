import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native'
import {
  styleSheetCreate,
  style,
  Color,
  windowWidth,
  fonts,
  ImageRepository,
  platform,
  isIphoneX,
  IdGenerator,
  styleSheetFlatten,
} from 'app/system/helpers'
import { Header } from 'app/module/global/view/Header'
import { SearchLoader } from 'app/module/global/view/SearchLoader'
import Modal from 'react-native-modal'
import { connectStore, IApplicationState } from 'app/system/store'
import { ThunkDispatch } from 'redux-thunk'
import { MainActions, MainAsynсActions } from '../store'
import { isEmpty } from 'lodash'
import { StackNavigationProp } from '@react-navigation/stack'
import { ListPages } from 'app/system/navigation'
import { getUniqueId } from 'react-native-device-info'
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions'
import moment from 'moment'
//@ts-ignore
import { CameraKitCamera } from 'react-native-camera-kit'
import ImageEditor from "@react-native-community/image-editor"

interface IStateProps extends IIsLoadingAddError {
  products: IGetProductResponce[]
  scannedProducts: any
  errorMessage: string
  isInternetReachable: boolean | null
  errorGropScan: boolean
  errorNetwork: boolean
}

interface IDispatchProps {
  getProduct(data: IGetProductRequest): Promise<void>
  getSuggestResearch(data: IGetSuggestResearchRequest): Promise<void>
  getProductWithoutLoader(data: IGetProductRequest): Promise<void>
  removeError(): void
  addLocalScannedProduct(data: any): void
  getProductsBarcodesInScan(data: any): Promise<void>
  removeError(): void
}

interface IProps {
  navigation: StackNavigationProp<any>
}

interface IState {
  scanState: typeof scanState[keyof typeof scanState]
  isModalShow: boolean
  barcodes: Array<number>
  isPermissionGiven: boolean | null
  isLoading: boolean
  isRecoginizeHintModalShow: boolean
  isBarcodeRecognizedModal: boolean
  isFirstTouchRecognize: boolean
  hideQrCode: boolean
}

const scanState = {
  recognize: 'RECOGNIZE',
  saveRecognize: 'SAVE_RECOGNIZE',
  suggestResearch: 'SUGGEST_RESEARCH',
  none: ''
}

@connectStore(
  (state: IApplicationState): IStateProps => ({
    isLoading: state.main.isLoading,
    error: state.main.error,
    products: state.main.products,
    scannedProducts: state.main.scannedProducts,
    errorMessage: state.main.errorMessage,
    isInternetReachable: state.network.isInternetReachable,
    errorGropScan: state.main.errorGropScan,
    errorNetwork: state.main.errorNetwork,
  }),
  (dispatch: ThunkDispatch<IApplicationState, void, any>): IDispatchProps => ({
    async getProduct(data) {
      await dispatch(MainAsynсActions.getProduct(data))
    },
    async getProductWithoutLoader(data) {
      await dispatch(MainAsynсActions.getProductWithoutLoader(data))
    },
    async getSuggestResearch(data) {
      await dispatch(MainAsynсActions.getSuggestResearch(data))
    },
    removeError() {
      dispatch(MainActions.removeError())
    },
    addLocalScannedProduct(data) {
      dispatch(MainActions.addLocalScannedProduct(data))
    },
    async getProductsBarcodesInScan(data) {
      await dispatch(MainAsynсActions.getProductsBarcodeInScan(data))
    },
  })
)
export class ScanProduct extends PureComponent<IProps & IDispatchProps & IStateProps, IState>  {
  refCamera: any
  previousBarcode: string = ''
  lastCallCamera: number = 0

  state = {
    scanState: scanState.none,
    isLoading: false,
    isModalShow: false,
    // barcodes: [4604087001279, 4604087001262],
    barcodes: [],
    isPermissionGiven: null,
    isRecoginizeHintModalShow: false,
    isBarcodeRecognizedModal: false,
    isFirstTouchRecognize: true,
    hideQrCode: false,
  }

  async componentDidMount() {
    this.props.removeError()
    if (platform.isIos) {
      const data = await request(PERMISSIONS.IOS.CAMERA)
      if (data === RESULTS.GRANTED) {
        this.setState({ isPermissionGiven: true })
      }
    } else {
      const data = await request(PERMISSIONS.ANDROID.CAMERA)
      if (data === RESULTS.GRANTED) {
        this.setState({ isPermissionGiven: true })
      }
    }
  }

  test = async () => {
  //  await this.props.getProduct({ qrCode: this.state.barcodes[this.state.barcodes.length - 1] })
    await this.props.getProductsBarcodesInScan({ barcodes: this.state.barcodes.filter(item => item) })
    this.props.navigation.push(ListPages.BarcodeSearchResults)
  }

  openSettingApplicationHandler = async (): Promise<void> => {
    try {
      await openSettings()
    } catch {
      Alert.alert('Ошибка', 'Невозможно открыть настройки')
    }
  }

  onBarCodeReadHandler = async (barcode : any): Promise<void> => {
    if (this.state.scanState !== scanState.none) {      
      const currentData: any = moment.utc().format('DD.MM.YYYY')
      const findProducts = this.props.scannedProducts.find((item: any) => item.title === currentData)
      if (isEmpty(this.state.barcodes) ||
        !this.state.barcodes.find((item: number) => item === barcode) ||
        !findProducts ||
        findProducts && !findProducts.data.find((item: any) => item.BARCODE)
      ) {
        this.lastCallCamera = moment().unix()
        const photoData = await this.refCamera.capture(false)
        const { width, height, uri } = photoData
        const isLandscapeOrientation = width > height
        // let uriImage =  await ImageEditor.cropImage(photoData.uri, {
        //   offset: {
        //     x: 0,
        //     y: 0,
        //   },
        //   size: {
        //     width: isLandscapeOrientation ? height : width, 
        //     height: isLandscapeOrientation ? width * 0.5 : height * 0.5,
        //   }
        // })
  
        if (this.state.scanState === scanState.recognize) {
          this.lastCallCamera = moment().unix()
          this.setState({ hideQrCode: true }, async () => {
            this.setState({ hideQrCode: false })
            this.setState({
              scanState: '',
              barcodes: [...this.state.barcodes, barcode].filter(item => item)
            }, async () => {
              const productInformation = {
                SITES: '',
                RESULT: '',
                IMAGE: {
                  SRC: uri,
                },
                STATE: scanState.suggestResearch,
                BARCODE: barcode,
                ID: IdGenerator.mongoObjectId(),
                isLandscapeOrientation,
              }
              if (this.props.isInternetReachable) {
                await this.props.getProduct({ qrCode: this.state.barcodes[this.state.barcodes.length - 1] })
                if (!this.props.error && !isEmpty(this.props.products) && !this.props.errorNetwork) {
                  this.props.addLocalScannedProduct(this.props.products)
                  this.previousBarcode = barcode
                  this.props.navigation.push(ListPages.BarcodeSearchResults)
                } else {
                  this.props.addLocalScannedProduct(productInformation)
                }
              } else {
                if (!this.props.errorNetwork) {
                  Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
                }
              }
            })
          })
        } else if (this.state.scanState === scanState.saveRecognize) {
          this.setState({
            barcodes: [...this.state.barcodes, barcode],
            isBarcodeRecognizedModal: true
          }, () => setTimeout(() => this.setState({ isBarcodeRecognizedModal: false }), 3000))
          this.setState({ hideQrCode: true }, () => setTimeout(async () => {
            this.setState({ hideQrCode: false })
            const productInformation = {
              SITES: '',
              RESULT: '',
              IMAGE: {
                SRC: uri,
              },
              STATE: scanState.suggestResearch,
              BARCODE: barcode,
              ID: IdGenerator.mongoObjectId(),
              isLandscapeOrientation,
            }
            this.props.addLocalScannedProduct(productInformation)
          }, 100))
        }
      } else {
        // console.log('else ')
      }
    }
  }

  recognizeHandler = async (): Promise<void> => {
    if (this.state.scanState === scanState.recognize) {
      this.setState({ scanState: scanState.none })
      return
    }

    if (
      !this.state.isFirstTouchRecognize &&
      this.state.scanState !== scanState.saveRecognize) {

      this.setState({ scanState: scanState.recognize })

    } else if (this.state.scanState !== scanState.saveRecognize) {
      this.setState({
        scanState: scanState.recognize,
        isFirstTouchRecognize: false,
        isRecoginizeHintModalShow: true,
      }, () => setTimeout(() => this.setState({ isRecoginizeHintModalShow: false }), 3000))
    }
    if (this.state.scanState === scanState.saveRecognize) {
        if (this.props.isInternetReachable) {
          this.setState({ scanState: scanState.none }, async () => {
            await this.props.getProductsBarcodesInScan({ barcodes: this.state.barcodes.filter(item => item) })
            this.props.addLocalScannedProduct(this.props.products)
            if (!this.props.errorGropScan && !isEmpty(this.props.products) && !this.props.errorNetwork) {
              this.props.navigation.navigate(ListPages.BarcodeSearchResults)
            } else {
              Alert.alert('Ошибка', 'Ничего не найдено')
            }
          })
        } else {
          if (!this.props.errorNetwork) {
            Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
          }
        }
    }
  }

  saveHandler = async (): Promise<void> => {
    this.setState({ scanState: scanState.saveRecognize, barcodes: [] })
  }

  assignRefCameraClassFieldHandler = (ref: any) => this.refCamera = ref

  suggestResearchHandler = async (): Promise<void> => {
    if (this.props.isInternetReachable) {
      const deviceId = await getUniqueId()
      await this.props.getSuggestResearch({
        device_id: deviceId,
        barcode: this.state.barcodes[this.state.barcodes.length - 1]
      })
      
      if (!this.props.error) {
        this.setState({ isModalShow: true }, this.props.removeError)
      } else {
        setTimeout(() => {
          Alert.alert('Ошибка', this.props.errorMessage || 'Данный товар уже предлагался на исследование',
            [
              {
                text: 'Ok',
                onPress: () => this.props.removeError()
              }
            ],
            { cancelable: false })
        }, 400)
      }
    } else {
      Alert.alert('Ошибка', 'Проверьте наличие интернета соединения')
    }
  }

  closeModalHandler = (): void => {
    this.setState({ isModalShow: false }, this.props.removeError)
  }

  closeBarcodeRecognizedModalHandler = (): void => {
    this.setState({ isBarcodeRecognizedModal: false })
  }

  closeRecoginizeHintModalShowModalHandler = (): void => {
    this.setState({ isRecoginizeHintModalShow: false })
  }

  render(): JSX.Element {

    const recognizeButton = styleSheetFlatten([
      styles.recognizeButton,
      {
        backgroundColor: this.state.scanState === scanState.recognize
          ? Color.pigment
          : Color.spanishBlue,
      }
    ])

    return (
      <View style={styles.mainContainer}>
        <Header />

        <Modal
          isVisible={this.state.isRecoginizeHintModalShow}
          onBackdropPress={this.closeRecoginizeHintModalShowModalHandler}
          style={styles.recoginizeHintModal}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.recoginizeHintModalContainer}>
            <Text style={styles.recoginizeHintModalContainerText}>
              Наведите камеру на штрихкод
            </Text>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isBarcodeRecognizedModal}
          style={styles.barcodeRecognizedModal}
          onBackdropPress={this.closeBarcodeRecognizedModalHandler}
          backdropOpacity={0}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={styles.barcodeRecognizedContainer}>
            <Text style={styles.barcodeRecognizedContainerText}>
              Распозан штрихкод: {this.state.barcodes[this.state.barcodes.length - 1]}
            </Text>
          </View>
        </Modal>

        <Modal
          isVisible={this.state.isModalShow}
          backdropOpacity={0.4}
          onBackdropPress={this.closeModalHandler}
          style={styles.modal}
        >
          <View style={styles.modalContainer}>
            <Image
              source={ImageRepository.scanProductResearch}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>
              {`Ваш запрос на исследование\nуспешно отправлен`}
            </Text>
            <TouchableOpacity
              onPress={this.closeModalHandler}
              style={styles.modalOkContainer}
            >
              <Image
                source={ImageRepository.scanProductSuggestOk}
                style={styles.modalOkImage}
              />
              <Text style={styles.modalOkText}>
                Ок
            </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <View style={styles.container}>
          {
            this.state.isPermissionGiven
              ? (
                <View style={{ flex: 1, justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: windowWidth * 0.8, height: windowWidth * 0.8, overflow: 'hidden' }}>
                      <CameraKitCamera
                        ref={this.assignRefCameraClassFieldHandler}
                        style={styles.camera}
                        onReadCode={event => {
                          const currentCameraCallTime = moment().unix()
                          if (this.lastCallCamera + 5 < currentCameraCallTime) {
                            this.onBarCodeReadHandler(event.nativeEvent.codeStringValue)
                          }
                        }}
                        scanBarcode={true}
                      />
                      {
                        this.state.scanState === scanState.none && !this.props.error
                          ? (
                            <View style={styles.splashCamera}>
                              <Text style={styles.barcodeScannedText}>
                                Нажми на одну из кнопок, чтобы активировать камеру
                            </Text>
                            </View>
                          )
                          : null
                      }
                      {
                        this.state.hideQrCode
                          ? (
                            <View style={styles.barcodeScannedCamera}>
                              <Text style={styles.barcodeScannedText}>
                                Штрихкод распозан
                            </Text>
                            </View>
                          )
                          : null
                      }
                    </View>
                  </View>
                  <View style={{ marginBottom: windowWidth * 0.1 }}>
                    {
                      !this.props.isLoading && !this.props.error
                        ? (
                          <View style={styles.buttonContainer}>
                            <TouchableOpacity
                              style={recognizeButton}
                              onPress={this.recognizeHandler}
                            >
                              <Image
                                style={styles.recognizeImage}
                                source={ImageRepository.scanProductRecognize}
                                resizeMode="contain"
                              />
                              <Text style={styles.recognizeText}>
                                {
                                  this.state.scanState === scanState.recognize
                                    ? 'Отменить сканирование'
                                    : this.state.scanState === scanState.saveRecognize
                                      ? 'Завершить сканирование'
                                      : 'Распознать'
                                }
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={this.saveHandler}
                              style={styles.saveButton}
                              disabled={this.state.scanState === scanState.saveRecognize}
                            >
                              <Image
                                style={styles.recognizeImage}
                                source={ImageRepository.scanProductSave}
                                resizeMode="contain"
                              />
                              <Text style={styles.saveText}>
                                Распознать и сканировать ещё
                            </Text>
                            </TouchableOpacity>
                          </View>
                        )
                        : null
                    }
                    <View style={styles.buttonContainer}>
                      <SearchLoader
                        isLoading={this.props.isLoading}
                        text="Поиск товара по штрихкоду"
                      />
                    </View>
                    {
                      this.props.error
                        ? (
                          <View style={styles.attention}>
                            <Image
                              source={ImageRepository.scanProductAttention}
                              style={styles.attentionImage}
                            />
                            <Text style={styles.attentionText}>
                              Товар в базах не найден
                            </Text>
                            <TouchableOpacity
                              style={styles.suggestResearch}
                              onPress={this.suggestResearchHandler}
                            >
                              <Image
                                source={ImageRepository.scanProductSuggestResearch}
                                style={styles.suggestResearchImage}
                              />
                              <Text style={styles.suggestResearchText}>
                                Предложить исследование
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )
                        : null
                    }
                  </View>
                </View>
              )
              : (
                <View style={styles.noPermissions}>
                  <Text style={styles.noPermissionsText}>
                    Предоставьте разрешения для камеры
                  </Text>
                  <TouchableOpacity
                    style={styles.openSetting}
                    onPress={this.openSettingApplicationHandler}
                  >
                    <Text style={styles.openSettingText}>
                      Открыть настройки
                    </Text>
                  </TouchableOpacity>
                </View>
              )
          }
        </View>
      </View>
    )
  }
}

const styles = styleSheetCreate({
  mainContainer: style.view({
    flex: 1,
    backgroundColor: Color.white,
  }),
  container: style.view({
    flex: 1,
  }),
  camera: style.view({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

  }),
  splashCamera: style.view({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.eerieBlack,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  barcodeScannedCamera: style.view({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color.eerieBlack,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  barcodeScannedText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    color: Color.white,
    textAlign: 'center',
  }),
  buttonContainer: style.view({
    width: windowWidth,
    alignItems: 'center',
  }),
  searhLoaderContainer: style.view({
    width: windowWidth,
    alignItems: 'center',
  }),
  recognizeButton: style.view({
    width: windowWidth * 0.8,
    height: windowWidth * 0.14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: windowWidth * 0.025,
  }),
  recognizeImage: style.view({
    width: windowWidth * 0.062,
    height: windowWidth * 0.05,
    marginRight: windowWidth * 0.027,
  }),
  recognizeText: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.white,
    fontSize: windowWidth * 0.037,
  }),
  saveButton: style.view({
    width: windowWidth * 0.8,
    height: windowWidth * 0.14,
    backgroundColor: Color.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.spanishBlue,
  }),
  saveImage: style.view({
    width: windowWidth * 0.062,
    height: windowWidth * 0.05,
    marginRight: windowWidth * 0.027,
  }),
  saveText: style.text({
    fontFamily: fonts.openSansSemiBold,
    color: Color.spanishBlue,
    fontSize: windowWidth * 0.037,
  }),
  attention: style.view({
    width: '100%',
    alignItems: 'center',
  }),
  attentionImage: style.image({
    width: windowWidth * 0.16,
    height: windowWidth * 0.147,
    marginBottom: windowWidth * 0.05,
  }),
  attentionText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    color: Color.pigment,
    marginBottom: windowWidth * 0.05,
  }),
  suggestResearch: style.view({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Color.spanishBlue,
    borderWidth: windowWidth * 0.005,
    width: windowWidth * 0.8,
    height: windowWidth * 0.14,
  }),
  suggestResearchImage: style.image({
    width: windowWidth * 0.072,
    height: windowWidth * 0.065,
    marginRight: windowWidth * 0.022,
  }),
  suggestResearchText: style.text({

  }),
  recoginizeHintModal: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: isIphoneX() ? windowWidth * 0.1 : platform.isIos ? windowWidth * 0.055 : windowWidth * 0.01,
  }),
  recoginizeHintModalContainer: style.view({
    paddingVertical: windowWidth * 0.04,
    paddingHorizontal: windowWidth * 0.06,
    width: windowWidth * 0.95,
    backgroundColor: Color.white,
    borderRadius: windowWidth * 0.05,
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.gray,
  }),
  recoginizeHintModalContainerText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
    textAlign: 'center',
  }),
  barcodeRecognizedModal: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: isIphoneX() ? windowWidth * 0.1 : platform.isIos ? windowWidth * 0.055 : windowWidth * 0.01,
  }),
  barcodeRecognizedContainer: style.view({
    paddingVertical: windowWidth * 0.04,
    paddingHorizontal: windowWidth * 0.06,
    width: windowWidth * 0.95,
    backgroundColor: Color.white,
    borderRadius: windowWidth * 0.05,
    borderWidth: windowWidth * 0.0025,
    borderColor: Color.gray,
  }),
  barcodeRecognizedContainerText: style.text({
    fontSize: windowWidth * 0.037,
    fontFamily: fonts.openSansSemiBold,
    color: Color.eerieBlack,
  }),
  productAlreadyAddeadModal: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  }),
  noPermissions: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  noPermissionsText: style.text({
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.036,
    marginBottom: windowWidth * 0.05,
  }),
  openSetting: style.view({
    width: windowWidth * 0.7,
    height: windowWidth * 0.13,
    backgroundColor: Color.spanishBlue,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  openSettingText: style.text({
    fontFamily: fonts.openSansRegular,
    fontSize: windowWidth * 0.036,
    color: Color.white,
  }),
  modal: style.view({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  modalContainer: style.view({
    backgroundColor: Color.white,
    height: windowWidth * 0.9,
    width: windowWidth * 0.75,
    alignItems: 'center',
  }),
  modalImage: style.image({
    marginBottom: windowWidth * 0.07,
    width: windowWidth * 0.18,
    height: windowWidth * 0.23,
    marginTop: windowWidth * 0.1,
  }),
  modalTitle: style.text({
    textAlign: 'center',
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
    color: Color.eerieBlack,
  }),
  modalOkContainer: style.view({
    alignItems: 'center',
    justifyContent: 'center',
    width: windowWidth * 0.47,
    height: windowWidth * 0.138,
    backgroundColor: Color.spanishBlue,
    flexDirection: 'row',
    marginTop: windowWidth * 0.06,
  }),
  modalOkText: style.text({
    color: Color.white,
    fontFamily: fonts.openSansSemiBold,
    fontSize: windowWidth * 0.037,
  }),
  modalOkImage: style.image({
    width: windowWidth * 0.055,
    height: windowWidth * 0.043,
    marginRight: windowWidth * 0.025,
  }),
})