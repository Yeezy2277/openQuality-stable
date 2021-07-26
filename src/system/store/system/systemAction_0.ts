import { actionCreator } from 'app/system/store/actionCreator'
import { EListLanguage} from 'app/system/helpers'

export class SystemAction {
  static setLanguage = actionCreator<EListLanguage>('SYSTEM/SET_LANGUAGE')
}
