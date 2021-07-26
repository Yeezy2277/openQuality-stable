import LocalizedStrings from 'react-native-localization'
import { listLocalization } from 'app/system/localization/listLocalization'

class Localization {
  readonly list = new LocalizedStrings(listLocalization)
}

export const localization = new Localization()
