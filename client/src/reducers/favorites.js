const reducer = (favorites = [], action) => {
  switch (action.type) {
    case 'CREATE_FAVORITE':
      return [...favorites, action.payload]
    case 'FETCH_FAVORITES':
      return action.payload
    case 'DELETE_FAVORITE':
      return action.payload
    default:
      return favorites
  }
}

export default reducer
