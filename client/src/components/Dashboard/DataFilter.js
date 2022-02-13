import React from 'react'
import { Select, MenuItem } from '@mui/material'

const DataFilter = ({ filter }) => {
  const onSubmit = (value) => {
    if (value === '') return
    filter(value)
  }

  return (
    <>
      <form>
        <label>Data</label>
        <Select
          onChange={(e) => onSubmit(e.target.value)}
          className="data-filter"
          defaultValue="volume">
          <MenuItem value="volume">Volume</MenuItem>
          <MenuItem value="sets">Sets</MenuItem>
        </Select>
      </form>
    </>
  )
}

export default DataFilter
