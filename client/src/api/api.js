import axios from 'axios'

//api urls
const workoutsUrl = process.env.REACT_APP_API +  'workouts/'
const usersUrl = process.env.REACT_APP_API + 'users'
const favoritesUrl = process.env.REACT_APP_API + 'favorites/'
const trainingWeeksUrl = process.env.REACT_APP_API + 'training-weeks/'

export const getFavorites = (params) => {
  const userUrl = favoritesUrl + params.user
  return axios.get(userUrl)
}

export const deleteFavorite = (params) => {
  const favUrl = favoritesUrl + params.user + '/' + params.name

  return axios.delete(favUrl)
}

export const getWorkouts = (params) => {

  console.log(workoutsUrl)

  const userUrl = workoutsUrl + params.user + '/workouts/' + params.trainingWeek
  return axios.get(userUrl)
}

export const getWorkoutsByDate = (params, startDate, endDate, exercise) => {
  let url = workoutsUrl + params.user + '/workouts'

 

  if (startDate) {
    url += `?startDate=${startDate}`
  }

  if (endDate) {
    url += `&endDate=${endDate}`
  }

  if (exercise) {
    url += `&exercise=${exercise}`
  }

  return axios.get(url)
}

export const getWorkout = (params) => {
  const idUrl = workoutsUrl + params.id
  return axios.get(idUrl)
}

export const deleteWorkout = (params) => {
  const idUrl = workoutsUrl + params.id
  return axios.delete(idUrl)
}

export const getTrainingWeeks = (params, startDate, endDate) => {
  let userUrl = trainingWeeksUrl + params.user

  if (startDate) {
    userUrl += `/?startDate=${startDate}`
  }

  if (endDate) {
    userUrl += `&endDate=${endDate}`
  }

  return axios.get(userUrl)
}

export const getTrainingWeek = (params) => {
  const url = trainingWeeksUrl + '/week/' + params.id

  console.log(url)

  return axios.get(url)
}

export const createWorkout = (newWorkout) => axios.post(workoutsUrl, newWorkout)

export const createFavorite = (newFavorite, user) => {
  const userUrl = favoritesUrl + `?user=${user.user}`

  return axios.post(userUrl, newFavorite)
}

export const createUser = (newUser) => axios.post(usersUrl, newUser)
