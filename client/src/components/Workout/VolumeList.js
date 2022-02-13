import React, { useState, useEffect } from 'react'
import Loader from '../Loader'
import { Container } from '@mui/material'
import { upperFirst } from '../../utils'

export const VolumeList = ({ data, unit }) => {
  const [totalVolume, setTotalVolume] = useState({})
  const [volume, setVolume] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (data.volume) {
      if (data.volume.totalVolume) {
        setTotalVolume(data.volume.totalVolume)
      }

      setVolume(Object.entries(data.volume))
      setIsLoading(false)
    }
  }, [data])

  return (
    <>
      {isLoading && !volume.length ? (
        <Loader />
      ) : (
        <div className="po__workout-details">
          <h3>
            Total Volume:{' '}
            {totalVolume &&
              totalVolume[unit] &&
              totalVolume[unit].toLocaleString('en')}{' '}
            {unit}{' '}
          </h3>
          {volume.length &&
            volume
              .filter(
                (group) => group[1].sets > 0 && group[0] !== 'totalVolume'
              )
              .map((group) => (
                <div key={group[0]} className="workout-data__muscle-group">
                  <h4>{upperFirst(group[0])} : </h4>
                  <div className="workout-data-meta">
                    <h5>Volume:</h5>
                    <p>
                      {group[1][unit].toLocaleString('en')} {unit}
                    </p>
                  </div>

                  <div className="workout-data-meta">
                    <h5>Sets:</h5>
                    <p>{group[1].sets}</p>
                  </div>
                </div>
              ))}
        </div>
      )}
    </>
  )
}
