import React from 'react'
import { Select, MenuItem } from '@mui/material'

const ViewFilter = ({ filter, hasFavorites, exercise }) => {
  const onSubmit = (value) => {
    if (value === '') return
    filter(value)
  }

  return (
    <>
      <form>
        <label>View</label>
        <Select
          onChange={(e) => onSubmit(e.target.value)}
          className="view-filter"
          defaultValue={
            exercise
              ? 'exercise'
              : localStorage.getItem('view')
              ? localStorage.getItem('view')
              : 'training-weeks'
          }>
          <MenuItem value="training-weeks">Weeks</MenuItem>
          <MenuItem value="workouts">Workouts</MenuItem>
          {hasFavorites && <MenuItem value="exercise">Exercise</MenuItem>}
        </Select>
      </form>
    </>
  )
}

export default ViewFilter
