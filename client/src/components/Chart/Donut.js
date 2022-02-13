import React from 'react'
import { Doughnut } from 'react-chartjs-2'

const DonutChart = ({ data, unit }) => {
  const afterBody = () => {
    return unit
  }

  const donutOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterBody: afterBody,
        },
      },
    },
  }

  return <>{data && <Doughnut data={data} options={donutOptions} />}</>
}

export default DonutChart
