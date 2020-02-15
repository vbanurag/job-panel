import { combineReducers } from 'redux'
import runtime from './runtime';

export default function createRootReducer () {
  return combineReducers({
      runtime
      })
}
