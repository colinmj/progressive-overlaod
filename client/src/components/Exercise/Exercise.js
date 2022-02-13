import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchExercise } from '../../api.js'
import { Container, Card } from '@mui/material'
import { upperFirst } from '../../utils'
import Loader from '../Loader'
import { isFavorite } from '../../utils'
import {
  createFavorite,
  getFavorites,
  deleteFavorite,
} from '../../actions/favorites.js'

const Exercise = () => {
  const [exercise, setExercise] = useState({})
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))
  const { id } = useParams()
  const dispatch = useDispatch()
  const userEmail = user.result.email

  useEffect(() => {
    fetchExercise(id).then((res) => {
      setExercise(res)
    })
  }, [id])

  useEffect(() => {
    dispatch(
      getFavorites({
        user: userEmail,
      })
    )
  }, [dispatch, userEmail])

  const favorites = useSelector((state) => state.favorites)

  const onSubmitFavorite = () => {
    exercise.user = userEmail
    dispatch(createFavorite(exercise, { user: userEmail }))
  }

  const onDeleteFavorite = () => {
    const favorite = favorites.filter((fav) => fav.name === exercise.name)[0]
    const { user, name } = favorite

    dispatch(deleteFavorite({ user, name }))

    dispatch(
      getFavorites({
        user: userEmail,
      })
    )
  }

  return (
    <Container maxWidth="lg" className="po-exercise">
      <Link
        to={`/exercise-library/?target=${exercise.target}`}
        style={{ marginBottom: 20, display: 'block' }}>
        Back To List
      </Link>

      {!Object.keys(exercise).length > 0 ? (
        <Loader />
      ) : (
        <Card
          className="po-exercise__info"
          style={{
            padding: 30,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}>
          <h3 style={{ flexBasis: '100%' }}>{upperFirst(exercise.name)}</h3>
          <div>
            <img src={exercise.gifUrl} alt={exercise.name} />
          </div>

          <div>
            <h4>Equipment Required: {upperFirst(exercise.equipment)}</h4>

            <h4>Target Area: {upperFirst(exercise.target)}</h4>

            {!isFavorite(exercise, favorites) ? (
              <div>
                <button className="button" onClick={() => onSubmitFavorite()}>
                  Add To Favorites
                </button>
              </div>
            ) : (
              <div>
                <button className="button" onClick={() => onDeleteFavorite()}>
                  Remove Favorite
                </button>
              </div>
            )}
          </div>
        </Card>
      )}
    </Container>
  )
}

export default Exercise
