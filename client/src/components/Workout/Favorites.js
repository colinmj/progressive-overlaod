import React from 'react'
import ExerciseList from './ExerciseList'

const Favorites = ({ favorites, callback }) => (
  <>
    <div className="exercise-select-form favorites">
      <h5>Choose From Favorites</h5>
      <ExerciseList
        exercises={favorites}
        callback={callback}
        label="Favorites"
      />
    </div>
  </>
)

export default Favorites
