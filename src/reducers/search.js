import {
  SET_SEARCH_RESULTS,
  SET_SEARCH_TEXT,
  CLEAR_RESULTS
} from '../constants'
import { merge } from 'ramda'

export default (state = { results: [], text: '' }, action) => {
  switch (action.type) {
    case SET_SEARCH_TEXT:
      return merge(state, { text: action.payload })
    case SET_SEARCH_RESULTS:
      return merge(state, { results: action.payload })
    case CLEAR_RESULTS:
      return merge(state, { results: [], text: '' })
    default:
      return state
  }
}
