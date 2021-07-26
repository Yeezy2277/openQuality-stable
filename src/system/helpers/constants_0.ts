import { Color } from './color'

export enum EPlatformName { 
  android = 'android',
  ios = 'ios'
}

export enum EListLanguage {
  ru = 'ru',
  en = 'en',
}

export enum EStatusBarStyle {
  lightContent = 'light-content',
  darkContent = 'dark-content',
}


export const COLORS = {
  'Не соответствует': Color.palePink,
  'Соответствует': Color.aliceBlue,
}