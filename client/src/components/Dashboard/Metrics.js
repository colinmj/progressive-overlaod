import React from 'react'
import { upperFirst } from '../../utils'
import { DateTime } from 'luxon'

const Metrics = ({
  rateOfGrowth,
  allVolume,
  averageVolume,
  target,
  unit,
  view,
  exercise,
  dataset,
  startDate,
  endDate,
}) => {
  const niceStartDate = DateTime.fromJSDate(startDate).toFormat('MMMM dd, yyyy')
  const niceEndDate = DateTime.fromJSDate(endDate).toFormat('MMMM dd, yyyy')

  return (
    <>
      <div>
        <h3>{view === 'training-weeks' ? 'Week View' : 'Workout View'}</h3>
        <p>Click a point on the chart to view</p>
        <h5>
          Showing data for:{' '}
          {exercise
            ? upperFirst(exercise)
            : target !== 'totalVolume'
            ? upperFirst(target)
            : 'All Muscle Groups'}
        </h5>

        <h5>
          From {niceStartDate} - {niceEndDate}
        </h5>

        <ul>
          <li>
            {allVolume.toLocaleString('en')} {dataset === 'volume' && unit}{' '}
            total {dataset}
          </li>
          <li>
            {averageVolume.toLocaleString('en')} {dataset === 'volume' && unit}{' '}
            average {dataset} per{' '}
            {view === 'training-weeks' ? 'week' : 'workout'}
          </li>
          {!isNaN(rateOfGrowth) && (
            <li className={rateOfGrowth < 0 ? 'decrease' : 'increase'}>
              {rateOfGrowth}% rate of increase
            </li>
          )}
        </ul>
      </div>
    </>
  )
}

export default Metrics
