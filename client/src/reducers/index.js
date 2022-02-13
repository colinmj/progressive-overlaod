import { combineReducers } from "redux";
import workouts from "./workouts.js";
import favorites from "./favorites";
import trainingWeeks from "./trainingWeeks";
import auth from "./auth.js";
import user from "./user.js";

export default combineReducers({
  workouts,
  favorites,
  trainingWeeks,
  auth,
  user,
});
