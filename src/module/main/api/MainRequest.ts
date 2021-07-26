import { ApiService } from 'app/system/api'

export class MainRequest {

  static getProduct = (params: IGetProductRequest): Promise<IGetProductResponce> => {
    return ApiService.get(
      'https://kachestvorb.ru/api/getproduct/' + params.qrCode,
    )
  }

  static getProductInScan = (params: any): Promise<IGetProductInScanResponce> => {
    return ApiService.get(
      'https://kachestvorb.ru/api/getproduct/' + params.BARCODE,
    )
  }

  static getProductResearch = (params: IGetProductResearchRequest): Promise<IGetProductResearchResponce> => {
    return ApiService.get('https://kachestvorb.ru/api/product/' + params.id)
  }

  static getManufacturerByIIN = (params: IGetManufacturerByIINRequest): Promise<IGetManufacturerByIINResponce> => {
    return ApiService.get(
      'https://kachestvorb.ru/api/inn/' + params.iin,
    )
  }

  static getSuggestResearch = (url: IGetSuggestResearchRequest): Promise<any> => {
    const params: URLSearchParams = new URLSearchParams()
    params.append('barcode', url.barcode)
    params.append('device_id', url.device_id)
    return ApiService.post(
      `https://kachestvorb.ru/api/suggestforresearch/`, params)
  }


  static getProductByName = (params: IGetProductByNameRequest): Promise<IGetProductByNameResponce> => {
    return ApiService.get('https://kachestvorb.ru/api/searchproducts/' + params.nameProduct)
  }

  static getResearchManufacturer = (params: IGetResearchManufacturerRequest): Promise<IGetResearchManufacturerResponce> => {
    return ApiService.get('https://kachestvorb.ru/api/getproducerproducts/' + params.idManufacturer)
  }


  static getProductWithoutLoader = (params: IGetProductRequest): Promise<IGetProductResponce> => {
    return ApiService.get(
      'https://kachestvorb.ru/api/getproduct/' + params.qrCode,
    )
  }

  static getProductsBarcode = (data: IGetProductBarCodeRequest): Promise<IGetProductBarCodeResponce> => {
    const bodyFormData = new URLSearchParams()
    
    data.barcodes.forEach((item) => {
      bodyFormData.append('barcodes[]', item)
    })

    return ApiService.post(
      `https://kachestvorb.ru/api/getproducts/`, bodyFormData)
  }

  static getListNotification = (): Promise<void> => {
    return ApiService.get(
      `http://188.225.77.30/notifier/get`)
  }

}
