import React from 'react'
import Loader from '../Loader'
import { upperFirst } from '../../utils'

const ExerciseList = ({
  exercises,
  callback,
  exerciseQuery,
  loading,
  label,
}) => {
  const onSubmit = (name, target, bodyPart, equipment, gifUrl, id) => {
    callback(name, target, bodyPart, equipment, gifUrl, id)
  }

  exercises = exercises.filter(
    (exercise) => exercise.target !== 'cardiovascular system'
  )

  return loading ? (
    <Loader />
  ) : (
    <div className="exercise-list">
      {exercises.length ? (
        <div className="exercise-select-form exercise-results">
          <label>{label} </label>
          <select
            onChange={(e) =>
              onSubmit(
                e.target.value,
                e.target.selectedOptions[0].getAttribute('data-target'),
                e.target.selectedOptions[0].getAttribute('data-bodypart'),
                e.target.selectedOptions[0].getAttribute('data-equipment'),
                e.target.selectedOptions[0].getAttribute('data-gifurl'),
                e.target.selectedOptions[0].getAttribute('data-id')
              )
            }>
            <option value="">Choose...</option>
            {exercises.map((exercise) => {
              return (
                <option
                  value={exercise.name}
                  data-target={exercise.target}
                  data-equipment={exercise.equipment}
                  data-bodypart={exercise.bodyPart}
                  data-id={exercise.id}
                  data-gifurl={exercise.gifUrl}
                  key={exercise.id}>
                  {upperFirst(exercise.name)}
                </option>
              )
            })}
          </select>
        </div>
      ) : (
        exerciseQuery && <h5>No Exercises Turned Up for: {exerciseQuery}</h5>
      )}
    </div>
  )
}

export default ExerciseList
