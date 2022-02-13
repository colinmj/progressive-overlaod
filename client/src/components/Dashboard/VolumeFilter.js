import React from 'react'
import { Select, MenuItem } from '@mui/material'

const VolumeFilter = ({ filter }) => {
  const onSubmit = (value) => {
    if (value === '') return
    filter(value)
  }

  return (
    <>
      <form>
        <label>Muscle Group</label>
        <Select
          onChange={(e) => onSubmit(e.target.value)}
          className="volume-filter"
          defaultValue={
            localStorage.getItem('target')
              ? localStorage.getItem('target')
              : 'totalVolume'
          }>
          <MenuItem value="totalVolume">All Muscles...</MenuItem>
          <MenuItem value="pectorals">Chest</MenuItem>
          <MenuItem value="quads">Quads</MenuItem>
          <MenuItem value="hamstrings">Hamstrings</MenuItem>
          <MenuItem value="triceps">Triceps</MenuItem>
          <MenuItem value="biceps">Biceps</MenuItem>
          <MenuItem value="glutes">Glutes</MenuItem>
          <MenuItem value="abs">Abs</MenuItem>
          <MenuItem value="upperback">Upper Back</MenuItem>
          <MenuItem value="lowerback">Lower Back</MenuItem>
          <MenuItem value="delts">Delts</MenuItem>
          <MenuItem value="calves">Calves</MenuItem>
          <MenuItem value="lats">Lats</MenuItem>
        </Select>
      </form>
    </>
  )
}

export default VolumeFilter
