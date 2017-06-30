import React from 'react'
import Header from '../containers/header'
import { Link } from 'react-router-dom'
import { TextField, Button, List, ImageListItem } from 'jrs-react-components'
import { map, propOr } from 'ramda'
import { connect } from 'react-redux'
import {
  SET_SEARCH_TEXT,
  SET_SEARCH_RESULTS,
  SET_FAVORITE,
  CLEAR_RESULTS
} from '../constants'
import LinkButton from '../components/link-button'

const Search = props => {
  const li = result => {
    return (
      <ImageListItem
        key={result.imdbID}
        title={result.Title}
        image={result.Poster}
        link={
          <Button onClick={props.selectMovie(props.history, result)}>
            Select
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <Header />
      <main>
        <div className="mw6 center mt2 tc">
          <form className="ph2 tl" onSubmit={props.handleSubmit}>
            <TextField
              label="Search"
              value={props.searchText}
              onChange={props.handleChange}
            />
            <div>
              <Button>Search</Button>
            </div>
          </form>
          <List>
            {map(li, propOr([], 'searchResults', props))}
          </List>
        </div>
      </main>
    </div>
  )
}

const connector = connect(mapStateToProps, mapActionsToProps)

function searchMovies(dispatch, getState) {
  const searchText = getState().search.text
  const url = process.env.REACT_APP_MOVIE_API

  fetch(url + '&s=' + searchText).then(res => res.json()).then(object => {
    if (object.Response === 'False') {
      alert('No Movies found...')
      return
    }
    dispatch({
      type: SET_SEARCH_RESULTS,
      payload: object.Search
    })
  })
}

function mapActionsToProps(dispatch) {
  return {
    selectMovie: (history, movie) => event => {
      const favorite = {
        title: movie.Title,
        year: movie.Year,
        poster: movie.Poster,
        imdbID: movie.imdbID
      }
      dispatch({ type: SET_FAVORITE, payload: favorite })
      dispatch({ type: CLEAR_RESULTS })
      history.push('/new')
    },
    handleSubmit: event => {
      event.preventDefault()
      dispatch(searchMovies)
    },
    handleChange: event =>
      dispatch({ type: SET_SEARCH_TEXT, payload: event.target.value })
  }
}

function mapStateToProps(state) {
  return {
    searchText: state.search.text,
    searchResults: state.search.results
  }
}

export default connector(Search)
