import React from 'react'
import { Line } from 'react-chartjs-2'
import { useHistory } from 'react-router-dom'

const LineChart = ({ data, urlParam, unit, dataset }) => {
  const history = useHistory()

  const afterBody = () => {
    return dataset === 'volume' ? unit : 'sets'
  }

  const lineChartOptions = {
    onClick: async (_, element) => {
      if (element.length) {
        let { index } = element[0]
        const id = data.ids[index]

        if (urlParam) {
          history.push(`/${urlParam}/${id}`)
        }
      }
    },

    scales: {
      y: {
        ticks: {
          callback: function (value, index, values) {
            return dataset === 'volume'
              ? value.toLocaleString('en') + unit
              : value
          },
        },
      },
      x: {
        ticks: {
          maxTicksLimit: window.innerWidth > 700 ? 16 : 3,
        },
      },
    },

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

  return <Line data={data} options={lineChartOptions} />
}

export default LineChart
