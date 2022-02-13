const reducer = (trainingWeeks = [], action) => {
  switch (action.type) {
    case "FETCH_TRAINING_WEEKS":
      return action.payload;
    case "FETCH_TRAINING_WEEK":
      return action.payload;
    default:
      return trainingWeeks;
  }
};

export default reducer;
