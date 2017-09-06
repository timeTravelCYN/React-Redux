import * as ActionTypes from './ActionTypes'
import AppDispatcher from './AppDispatcher'

export const increment = (counterCation) => {
  AppDispatcher.dispatch({
    type: ActionTypes.INCREMENT,
    counterCation: counterCation
  })
}

export const decrement = (counterCation) => {
  AppDispatcher.dispatch({
    type: ActionTypes.DECREMENT,
    counterCation: counterCation
  })
}