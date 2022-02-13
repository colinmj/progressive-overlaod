import React from 'react'
import { Bar } from 'react-chartjs-2'
import { useHistory } from 'react-router-dom'

export const BarChart = ({ data, urlParam, unit }) => {
  const { datasets } = data
  const history = useHistory()

  const afterBody = () => {
    return unit
}

  const barChartOptions = {
    onClick: async (e, element) => {
      const index = (await element[0]) && element[0]['index']
      const workoutId = datasets[0]['id'][index]

      if (workoutId) {
        history.push(`/${urlParam}/${workoutId}`)
      }
    },
    scales: {
      y: {
        ticks: {
          callback: function (value, index, values) {
            return value.toLocaleString('en') + unit
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: window.innerWidth > 700 ? 16 : 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          afterBody: afterBody,
        },
      },
    },
  }
  return (
    <>
      {data && (
        <div>
          <label>Click on a bar to view workout!</label>
          <Bar data={data} options={barChartOptions} />
        </div>
      )}
    </>
  )
}

export default BarChart
