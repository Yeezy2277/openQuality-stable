import { EListLanguage } from 'app/system/helpers'

export interface ISystemState {
  language: EListLanguage
}

export const SystemInitialState: ISystemState = {
  language: EListLanguage.ru,
}