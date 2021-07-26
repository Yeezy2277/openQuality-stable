import { actionCreatorFactory } from 'typescript-fsa'
import { asyncFactory } from 'typescript-fsa-redux-thunk'
import { IApplicationState } from "app/system/store"

export const actionCreator = actionCreatorFactory()
export const asyncActionCreator = asyncFactory<IApplicationState>(actionCreator)