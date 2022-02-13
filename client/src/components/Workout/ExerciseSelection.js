import React from "react";
import ExerciseFilter from "./ExerciseFilter";
import ExerciseSearch from "./ExerciseSearch";

const ExerciseSelection = ({ searchFunction, filterFunction }) => {
  return (
    <>
      <div>
        <h5>Search By Name</h5>
        <ExerciseSearch search={searchFunction} />
      </div>

      <div>
        <h5>Or Filter By Target Muscle</h5>
        <ExerciseFilter search={filterFunction} />
      </div>
    </>
  );
};

export default ExerciseSelection;
