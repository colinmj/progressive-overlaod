import * as api from '../api/api.js'

export const createFavorite = (favorite, user) => async (dispatch) => {
  try {
    const { data } = await api.createFavorite(favorite, user)
    dispatch({ type: 'CREATE_FAVORITE', payload: data })
  } catch (error) {
    console.log(error.message)
  }
}

export const deleteFavorite = (params) => async (dispatch) => {
  try {
    const { data } = await api.deleteFavorite(params)

    dispatch({ type: 'DELETE_FAVORITE', payload: data })
  } catch (error) {
    console.log(error)
  }
}

export const getFavorites = (params) => async (dispatch) => {
  try {
    const { data } = await api.getFavorites(params)

    dispatch({ type: 'FETCH_FAVORITES', payload: data })
  } catch (error) {
    console.log(error.message)
  }
}
