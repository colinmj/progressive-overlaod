import { DateTime } from 'luxon'

export const upperFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const isFavorite = (theExercise, theFavorites) => {
  return theFavorites.filter((fav) => fav.name === theExercise.name).length > 0
}

export const elSortino = (arr, field) => {
  return arr.sort((a, b) => {
    return a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0
  })
}

export const calculateGrowthRate = (data) => {
  let growthRatios = []

  for (let i = 0; i < data.length; i++) {
    let growth = (data[i + 1] - data[i]) / data[i]

    if (growth) {
      growthRatios.push(parseFloat(growth.toFixed(2)) * 100)
    }
  }

  return parseFloat(
    (growthRatios.reduce((a, b) => a + b, 0) / growthRatios.length).toFixed(2)
  )
}

export const calculateTotal = (data) => {
  return data.reduce((a, b) => a + b)
}

export const calculateAverage = (data) => {
  return data.reduce((a, b) => a + b) / data.length
}

export const formateZeDate = (leDate) => {
  const rawDate = new Date(leDate)
  const niceDate = DateTime.fromJSDate(rawDate).toFormat('d/M/yy')

  return niceDate
}
