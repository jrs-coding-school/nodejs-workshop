import React from 'react'
import MovieCard from '../components/movie-card'
import Header from '../containers/header'
import BigButton from '../components/big-button'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { filter, head } from 'ramda'
import { SET_FAVORITE } from '../constants'

// function propEquals(property, value) {
//   return function(fav) {
//     console.log('id', value)
//     console.log('fav.id', fav[property])
//     return fav[property] === Number(value)
//   }
// }

function propEquals(id) {
  return function(fav) {
    return fav['id'] === Number(id)
  }
}

class Show extends React.Component {
  componentDidMount() {
    console.log('params: ', this.props.match.params.id)
    console.log('favorites: ', this.props.favorites)
    const favorite = head(
      filter(propEquals(this.props.match.params.id), this.props.favorites)
    )
    console.log(favorite)
    this.props.dispatch({ type: SET_FAVORITE, payload: favorite })
  }
  render() {
    const props = this.props
    return (
      <div>
        <Header />
        <main>
          <div className="mw6 center mt2 tc">
            <MovieCard
              image={props.favorite.poster}
              title={props.favorite.title}
              year={props.favorite.year}
            />
          </div>
          <div className="mw6 tc center">
            <Link to="/"><BigButton>Return</BigButton></Link>
          </div>
        </main>
      </div>
    )
  }
}

const connector = connect(mapStateToProps)

function mapStateToProps(state) {
  return {
    favorites: state.favorites,
    favorite: state.favorite
  }
}

export default connector(Show)
