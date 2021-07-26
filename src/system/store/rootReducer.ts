import { combineReducers } from 'redux'
import { systemReducer } from 'app/system/store/system'
import { networkReducer } from 'app/module/network/store'
import { mainReducer } from 'app/module/main/store'

export const rootReducer = combineReducers({
  system: systemReducer,
  main: mainReducer,
  network: networkReducer,
})

