import { asyncActionCreator } from 'app/system/store/actionCreator'
import {  MainRequest } from '../api/MainRequest'

export class MainAsynсActions {

  static getProduct = asyncActionCreator<IGetProductRequest, IGetProductResponce, Error>(
    'MAIN/GET_PRODUCT',
    MainRequest.getProduct
  )

  static getProductInScan = asyncActionCreator<any, any, Error>(
    'MAIN/GET_PRODUCT_IN_SCAN',
    MainRequest.getProductInScan
  )

  static getProductWithoutLoader = asyncActionCreator<IGetProductRequest, IGetProductResponce, Error>(
    'MAIN/GET_PRODUCT_WITHOUT_LOADER',
    MainRequest.getProductWithoutLoader
  )

  static getProductResearch = asyncActionCreator<IGetProductResearchRequest, IGetProductResearchResponce, Error>(
    'MAIN/GET_PRODUCT_REREACH',
    MainRequest.getProductResearch
  )
  
  static getManufacturerByIIN = asyncActionCreator<IGetManufacturerByIINRequest, IGetManufacturerByIINResponce, Error>(
    'MAIN/GET_MANUFACTURER_BY_IIN',
    MainRequest.getManufacturerByIIN
  )
  
  static getSuggestResearch = asyncActionCreator<IGetSuggestResearchRequest, IGetSuggestResearchResponce, Error>(
    'MAIN/SUGGEST_RESEARCH',
    MainRequest.getSuggestResearch,
  )
  
  static getProductByName = asyncActionCreator<IGetProductByNameRequest, IGetProductByNameResponce, Error>(
    'MAIN/GET_PRODUCT_BY_NAME',
    MainRequest.getProductByName,
  )
  
  static getResearchManufacturer = asyncActionCreator<IGetResearchManufacturerRequest, IGetResearchManufacturerResponce, Error>(
    'MAIN/GET_RESEARCH_MANUFACTURER',
    MainRequest.getResearchManufacturer,
  )
  
  static getProductsBarcode = asyncActionCreator<IGetProductBarCodeRequest, IGetProductBarCodeResponce, Error>(
    'MAIN/GET_PRODUCTS_BARCODE',
    MainRequest.getProductsBarcode,
  )
  
  static getProductsBarcodeInScan = asyncActionCreator<IGetProductBarCodeRequest, IGetProductBarCodeResponce, Error>(
    'MAIN/GET_PRODUCTS_BARCODE_IN_SCAN',
    MainRequest.getProductsBarcode,
  )
  
  static getListNofification = asyncActionCreator<any, any, Error>(
    'MAIN/GET_LIST_NOTIFICATION',
    MainRequest.getListNotification,
  )
  
}