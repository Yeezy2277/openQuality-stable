interface IGetProductRequest {
  qrCode: number
}

interface IGetProductResponce {
  ID: string
  NAME: string
  SITES: string
  IMAGE: {
    SRC: string
  }
}
interface IGetProductInScanRequest {
  // qrCode: number
}

interface IGetProductInScanResponce {
  // ID: string
  // NAME: string
  // SITES: string
  // IMAGE: {
  //   SRC: string
  // }
}

interface IGetProductResearchRequest {
  id: string
  // item: any
}

interface IGetProductResearchResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface IGetManufacturerByIINRequest {
  iin: string
}

interface IGetManufacturerByIINResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface IGetSuggestResearchRequest {
  barcode: number
  device_id: string
}

interface IGetSuggestResearchResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface IGetProductBarCodeRequest {
  barcodes: Array<string>
}

interface IGetProductBarCodeResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface IGetProductByNameRequest {
  nameProduct: string
}

interface IGetProductByNameResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface IGetResearchManufacturerRequest {
  idManufacturer: string
}

interface IGetResearchManufacturerResponce {
  // ID: string
  // NAME: string
  // SITES: string
}

interface INotification {
  notificationID: string
  date: string
  title: string
  body: string
  isRead: boolean
  unixTime: number
}
