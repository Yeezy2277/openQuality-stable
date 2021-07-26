import { ReducerBuilder, reducerWithInitialState } from 'typescript-fsa-reducers'
import { EListLanguage } from 'app/system/helpers'
import { ISystemState, SystemInitialState } from 'app/system/store/system/systemState'
import { SystemAction } from 'app/system/store/system/systemAction'

const setLanguage = (state: ISystemState, payload: EListLanguage): ISystemState => {
  return {
    ...state,
    language: payload,
  }
}

export const systemReducer: ReducerBuilder<ISystemState> = reducerWithInitialState(SystemInitialState)
  .case(SystemAction.setLanguage, setLanguage)