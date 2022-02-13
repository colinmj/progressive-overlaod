import React from 'react'

const ExerciseFilter = ({ search }) => {
  const onSubmit = (value) => {
    search(value)
  }

  return (
    <>
      <div className="exercise-select-form">
        <select onChange={(e) => onSubmit(e.target.value)}>
          <option value="">Muscle...</option>
          <option value="pectorals">Chest</option>
          <option value="quads">Quads</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="triceps">Triceps</option>
          <option value="biceps">Biceps</option>
          <option value="glutes">Glutes</option>
          <option value="abs">Abs</option>
          <option value="upper back">Upper Back</option>
          <option value="delts">Delts</option>
          <option value="calves">Calves</option>
          <option value="lats">Lats</option>
        </select>
      </div>
    </>
  )
}

export default ExerciseFilter
