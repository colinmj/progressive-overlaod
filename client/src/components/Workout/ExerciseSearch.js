import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const ExerciseSearch = ({ search }) => {
  const [exercise, setExercise] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    search(exercise)
  }

  return (
    <>
      <form onSubmit={onSubmit} className="exercise-select-form search-form">
        <div className="exercise-search">
          <label>Search Exercises</label>
          <input
            type="text"
            value={exercise.toLowerCase()}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="Search..."
          />
          <button className="search-btn" disabled={exercise.length === 0}>
            <FaSearch />
          </button>
        </div>
      </form>
    </>
  )
}

export default ExerciseSearch
