import { SET_FAVORITES, APPEND_FAVORITE } from '../constants'
import { append } from 'ramda'

export default (state = [], action) => {
  switch (action.type) {
    case SET_FAVORITES:
      return action.payload
    case APPEND_FAVORITE:
      return append(action.payload, state)
    default:
      return state
  }
}
