//import EXERCISE_API_KEY from './config'
const EXERCISE_API_KEY = process.env.REACT_APP_API_KEY

const baseUrl = 'https://exercisedb.p.rapidapi.com/exercises/name/'
const targetUrl = 'https://exercisedb.p.rapidapi.com/exercises/target/'
const targetList = 'https://exercisedb.p.rapidapi.com/exercises/targetList'
const singleExercise = 'https://exercisedb.p.rapidapi.com/exercises/exercise/'

export const fetchExercisesByName = async (name) => {
  const response = await fetch(baseUrl + name, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      'x-rapidapi-key': EXERCISE_API_KEY,
    },
  })

  const result = await response.json()
  return result
}

export const fetchExercisesByTarget = async (target) => {
  const response = await fetch(targetUrl + target, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      'x-rapidapi-key': EXERCISE_API_KEY,
    },
  })

  const result = await response.json()
  return result
}

export const fetchMuscles = async () => {
  const response = await fetch(targetList, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      'x-rapidapi-key': EXERCISE_API_KEY,
    },
  })

  const result = await response.json()

  return result
}

export const fetchExercise = async (id) => {
  const response = await fetch(singleExercise + id, {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com',
      'x-rapidapi-key': EXERCISE_API_KEY,
    },
  })

  const result = await response.json()

  return result
}
