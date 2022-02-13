const reducer = (workouts = [], action) => {
  switch (action.type) {
    case "CREATE":
      return [...workouts, action.payload];
    case "FETCH_WORKOUTS":
      return action.payload;
    case "FETCH_WORKOUT":
      return action.payload;
    case "DELETE_WORKOUT":
      return action.payload;
    default:
      return workouts;
  }
};

export default reducer;
