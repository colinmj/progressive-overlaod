import * as api from '../api/api.js'

export const getTrainingWeeks =
  (params, startDate, endDate) => async (dispatch) => {
    try {
      const { data } = await api.getTrainingWeeks(params, startDate, endDate)

      dispatch({ type: 'FETCH_TRAINING_WEEKS', payload: data })
    } catch (error) {
      console.log(error.message)
    }
  }

export const getTrainingWeek = (params) => async (dispatch) => {
  try {
    const { data } = await api.getTrainingWeek(params)
    dispatch({ type: 'FETCH_TRAINING_WEEK', payload: data })
  } catch (error) {
    console.log(error.message)
  }
}
