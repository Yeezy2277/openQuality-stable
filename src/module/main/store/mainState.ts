export interface IMainState {
  isLoading: boolean
  error: boolean
  errorMessage: string
  isRequestDone: boolean
  products: IGetProductResponce[]
  researchProduct: any
  manufacturerByIin: any
  listNotification: INotification[]
  searchProductByName: any
  researchManufacturer: any
  scannedProducts: any
  errorGropScan: boolean
  errorNetwork: boolean
  isNotificationLoading: boolean
  dateInstallation: number | null
}

export const MainInitialState: IMainState = {
  isLoading: false,
  errorNetwork: false,
  error: false,
  errorGropScan: false,
  errorMessage: '',
  isRequestDone: false,
  products: [],
  researchProduct: {},
  manufacturerByIin: {},
  listNotification: [],
  searchProductByName: [],
  researchManufacturer: [],
  scannedProducts: [],
  isNotificationLoading: false,
  dateInstallation: null,
}
