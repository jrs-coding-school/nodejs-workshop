import React from 'react'
import Header from '../containers/header'
import { Link } from 'react-router-dom'
import { TextField, Button } from 'jrs-react-components'
import BigButton from '../components/big-button'
import { connect } from 'react-redux'
import {
  SET_FAVORITE_TITLE,
  SET_FAVORITE_YEAR,
  SET_FAVORITE_POSTER,
  SET_FAVORITE_RANK,
  APPEND_FAVORITE,
  CLEAR_FAVORITE
} from '../constants'

const Form = props =>
  <div>
    <Header />
    <main>
      <div className="mw6 pv2 ph3 center mt2">
        <div className="cf">
          <div className="fr">
            <Link to="/search">
              <Button>Search</Button>
            </Link>
          </div>
        </div>
        <h2>Add New Favorite</h2>
        <form onSubmit={props.handleSubmit(props.history)}>
          <TextField
            value={props.favorite.title}
            onChange={props.setTitle}
            label="Movie"
            optional={false}
            help="Enter Movie Name"
          />
          <TextField
            value={props.favorite.year}
            onChange={props.setYear}
            label="Year"
            optional={false}
            help="Enter Movie Year"
          />
          <TextField
            value={props.favorite.poster}
            onChange={props.setPoster}
            label="Poster"
            optional={false}
            help="Enter Movie Poster"
          />
          <TextField
            value={props.favorite.rank}
            onChange={props.setRank}
            label="Rank"
            optional={false}
            help="Enter Rank"
            width={20}
          />
          <div className="mt4 center tc">
            <BigButton>Create Favorite</BigButton>
          </div>
        </form>
      </div>
    </main>
  </div>

const connector = connect(mapStateToProps, mapActionsToProps)

const setFavorite = history => (dispatch, getState) => {
  const favorite = getState().favorite
  fetch(process.env.REACT_APP_API + '/favorites', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(favorite)
  })
    .then(res => res.json())
    .then(favorite => {
      dispatch({
        type: APPEND_FAVORITE,
        payload: favorite
      })
    })

  dispatch({
    type: CLEAR_FAVORITE
  })
  history.push('/')
}

function mapActionsToProps(dispatch) {
  return {
    handleSubmit: history => event => {
      event.preventDefault()
      dispatch(setFavorite(history))
    },
    setRank: event =>
      dispatch({
        type: SET_FAVORITE_RANK,
        payload: event.target.value
      }),
    setPoster: event =>
      dispatch({
        type: SET_FAVORITE_POSTER,
        payload: event.target.value
      }),
    setYear: event =>
      dispatch({
        type: SET_FAVORITE_YEAR,
        payload: event.target.value
      }),
    setTitle: event =>
      dispatch({
        type: SET_FAVORITE_TITLE,
        payload: event.target.value
      })
  }
}

function mapStateToProps(state) {
  return {
    favorite: state.favorite
  }
}

export default connector(Form)
