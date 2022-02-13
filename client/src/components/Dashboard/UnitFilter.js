import React from 'react'
import { Select, MenuItem } from '@mui/material'

export const UnitFilter = ({ filter }) => {
  const onSubmit = (value) => {
    if (value === '') return
    filter(value)
  }

  return (
    <>
      <form>
        <label>Unit</label>
        <Select
          onChange={(e) => onSubmit(e.target.value)}
          defaultValue={
            localStorage.getItem('metric')
              ? localStorage.getItem('metric')
              : 'lbs'
          }>
          <MenuItem value="lbs">Lbs</MenuItem>
          <MenuItem value="kg">Kg</MenuItem>
        </Select>
      </form>
    </>
  )
}

export default UnitFilter
