import React, { useState } from 'react'
import { upperFirst } from '../../utils'
import { useSelector, useDispatch } from 'react-redux'
import { TextField, InputAdornment, Card } from '@mui/material'

const Lift = ({
  exercise,
  callback,
  addToFavorites,
  getFavorites,
  removeFromFavorites,
  unit,
  userEmail,
}) => {
  const [lbs, setLbs] = useState(0)
  const [kg, setKg] = useState(0)
  const [sets, setSets] = useState(0)
  const [reps, setReps] = useState(0)
  const { name, target, gifUrl, equipment } = exercise
  const favorites = useSelector((state) => state.favorites)
  const dispatch = useDispatch()

  const isFavorite = (theExercise, theFavorites) => {
    return (
      theFavorites.filter((fav) => fav.name === theExercise.name).length > 0
    )
  }

  const onSubmit = (e) => {
    e.preventDefault()

    callback(lbs, kg, sets, reps, target, unit)

    setLbs(0)
    setKg(0)
    setSets(0)
    setReps(0)
  }

  const onSubmitFavorite = () => {
    addToFavorites(exercise)
  }

  const onDeleteFavorite = () => {
    const favorite = favorites.filter((fav) => fav.name === exercise.name)[0]

    removeFromFavorites(favorite)

    dispatch(
      getFavorites({
        user: userEmail,
      })
    )
  }

  const setWeight = (value) => {
    if (unit === 'lbs') {
      setLbs(value)
      setKg(parseFloat(value / 2.205).toFixed(2))
    } else {
      setKg(value)
      setLbs(parseFloat(value * 2.205).toFixed(2))
    }
  }

  return (
    <Card className="lift">
      <section className="lift__intro">
        <h4>{upperFirst(name)}</h4>
        <p>
          Target: <span>{upperFirst(target)}</span>
        </p>
        <p>
          Equipment Required:<span>{upperFirst(equipment)}</span>
        </p>

        <img src={gifUrl} alt={name} />

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
      </section>

      <form onSubmit={onSubmit} className="lift__form">
        <div>
          <label>Weight</label>
          <TextField
            type="number"
            value={unit === 'lbs' ? lbs : kg}
            onChange={(e) => setWeight(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{unit}</InputAdornment>
              ),
            }}
          />
        </div>

        <div>
          <label>Sets</label>
          <TextField
            type="number"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
        </div>

        <div>
          <label>Reps</label>
          <TextField
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />
        </div>

        <button className="button">Add Lift</button>
      </form>
    </Card>
  )
}

export default Lift
