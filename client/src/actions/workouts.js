import * as api from '../api/api.js'

export const createWorkout = (workout) => async (dispatch) => {
  try {
    const { data } = await api.createWorkout(workout)
    dispatch({ type: 'CREATE', payload: data })
  } catch (error) {
    console.log(error.mesage)
  }
}

export const getWorkouts = (params) => async (dispatch) => {
  try {
    const { data } = await api.getWorkouts(params)
    dispatch({ type: 'FETCH_WORKOUTS', payload: data })
  } catch (error) {
    console.log(error.message)
  }
}

export const getWorkoutsByDate =
  (params, startDate, endDate, exercise) => async (dispatch) => {
    try {
      const { data } = await api.getWorkoutsByDate(
        params,
        startDate,
        endDate,
        exercise
      )
      dispatch({ type: 'FETCH_WORKOUTS', payload: data })
    } catch (error) {
      console.log(error.message)
    }
  }

export const getWorkout = (params) => async (dispatch) => {
  try {
    const { data } = await api.getWorkout(params)
    dispatch({ type: 'FETCH_WORKOUT', payload: data })
  } catch (error) {
    console.log(error.message)
  }
}

export const deleteWorkout = (params) => async (dispatch) => {
  try {
    const { data } = await api.deleteWorkout(params)
    dispatch({ type: 'DELETE_WORKOUT', payload: data })
  } catch (error) {
    console.log(error)
  }
}
