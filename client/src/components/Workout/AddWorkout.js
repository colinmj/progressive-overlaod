import React, { useState, useEffect } from 'react'
import { DateTime } from 'luxon'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { Modal, Box, Button, Container, TextField } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'

//actions
import { createWorkout, getWorkouts } from '../../actions/workouts.js'
import {
  createFavorite,
  getFavorites,
  deleteFavorite,
} from '../../actions/favorites.js'

//components
import Lift from './Lift'
import UnitFilter from '../../components/Dashboard/UnitFilter.js'
import ExerciseSelection from './ExerciseSelection.js'
import ExerciseList from './ExerciseList.js'
import Favorites from './Favorites.js'
import WorkoutList from './WorkoutList.js'

//functions
import { fetchExercisesByName, fetchExercisesByTarget } from '../../api.js'

const dateFormat = {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
}

const trainingWeek =
  DateTime.now().startOf('week').toFormat('dd LLL yy') +
  ' - ' +
  DateTime.now().endOf('week').toFormat('dd LLL yy')

const weekStart = DateTime.now().startOf('week').toISODate()
const weekEnd = DateTime.now().endOf('week').toISODate()

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  maxHeight: 500,
  overflow: 'scroll',
  display: 'block',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#fff',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

const AddWorkout = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const [openModal, setOpenModal] = useState(false)
  const [unit, setUnit] = useState('lbs')
  const [exerciseQuery, setExerciseQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const userEmail = user.result.email
  const location = useLocation()

  const [workoutData, setWorkoutData] = useState({
    user: userEmail,
    openSubmit: false,
    date: new Date(),
    title: '',
    dateString: DateTime.now().toLocaleString(dateFormat),
    type: '',
    exerciseList: [],
    totalSets: [],
    currentExercise: {
      user: userEmail,
      name: '',
      target: '',
      bodyPart: '',
      equipment: '',
      gifUrl: '',
      id: '',
    },
    searchResults: [],
    volume: {
      totalVolume: { lbs: 0, kg: 0, sets: 0 },
      pectorals: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      triceps: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      biceps: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      glutes: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      hamstrings: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      quads: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      abs: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      lats: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      delts: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      upperback: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      lowerback: { lbs: 0, kg: 0, sets: 0, reps: 0 },
      calves: { lbs: 0, kg: 0, sets: 0, reps: 0 },
    },

    sets: 0,
    reps: 0,
    trainingWeek,
    weekStart,
    weekEnd,
  })

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('profile')))
  }, [location, user?.token])

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      getFavorites({
        user: userEmail,
      })
    )
  }, [dispatch, userEmail])

  const favorites = useSelector((state) => state.favorites)
  const workouts = useSelector((state) => state.workouts)

  useEffect(() => {
    console.log('added workout')
    console.log(workouts)
    //window.location.href = '/'
  }, [workouts])

  //add workout to database and redirect to the dashboard
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createWorkout(workoutData))

    //window.location.href = '/'
  }

  const filterUnit = (value) => {
    setUnit(value)
  }

  //allows user to add exercises to the favorite
  const addToFavorites = (exercise) => {
    dispatch(createFavorite(exercise, { user: userEmail }))
  }

  const removeFromFavorites = (favorite) => {
    const { user, name } = favorite

    dispatch(deleteFavorite({ user, name }))
  }

  //displays results from dropdown
  const filterExercise = (target) => {
    setExerciseQuery(target)
    setLoading(true)

    fetchExercisesByTarget(target).then((results) => {
      setLoading(false)
      setWorkoutData({ ...workoutData, searchResults: results })
    })
  }

  //dispays results from seach
  const searchExercise = (exercise) => {
    setExerciseQuery(exercise)
    setLoading(true)
    fetchExercisesByName(exercise).then((results) => {
      setLoading(false)
      setWorkoutData({ ...workoutData, searchResults: results })
    })
  }

  //sets the current exercise
  const chooseExercise = (name, target, bodyPart, equipment, gifUrl, id) => {
    if (target)
      setWorkoutData({
        ...workoutData,
        currentExercise: {
          ...workoutData.currentExercise,
          name: name.trim(),
          target: target.replace(/\s/g, ''),
          bodyPart,
          equipment,
          gifUrl,
          id,
        },
      })
  }

  const removeLift = (index, target, totalVolume, targetVolume) => {
    console.log(totalVolume)

    setWorkoutData({
      ...workoutData,
      totalSets: workoutData.totalSets.filter((set, i) => i !== index),
      exerciseList: workoutData.exerciseList.filter(
        (exercise, i) => i !== index
      ),

      volume: {
        ...workoutData.volume,
        totalVolume: {
          ...workoutData.volume.totalVolume,
          lbs: workoutData.volume.totalVolume.lbs - totalVolume.lbs,
          kg: workoutData.volume.totalVolume.kg - totalVolume.kg,
          sets: workoutData.volume.totalVolume.sets - targetVolume.sets,
        },
        [target]: {
          ...workoutData.volume[target],
          lbs: workoutData.volume[target].lbs - targetVolume.lbs,
          kg: workoutData.volume[target].kg - targetVolume.kg,
          sets: workoutData.volume[target].sets - targetVolume.sets,
        },
      },

      sets: workoutData.sets - targetVolume.sets,
    })
  }

  //close el modal for adding workout
  const handleCloseModal = () => setOpenModal(false)

  //adding a set to workoutData
  const addSet = (lbs, kg, sets, reps, target) => {
    if (sets && reps) {
      setWorkoutData({
        ...workoutData,
        exerciseList: [
          ...workoutData.exerciseList,
          workoutData.currentExercise.name.trim(),
        ],
        totalSets: [
          ...workoutData.totalSets,
          {
            exercise: workoutData.currentExercise.name,
            lifts: [
              {
                lbs,
                kg,
                sets,
                reps,
              },
            ],
            volume: {
              totalVolume: {
                lbs: sets * reps * lbs,
                kg: sets * reps * kg,
                sets: parseInt(sets),
              },
              [target]: {
                lbs: +parseFloat(sets * reps * lbs).toFixed(2),
                kg: +parseFloat(sets * reps * kg).toFixed(2),
                sets: +sets,
                reps: sets * reps,
              },
            },
            target,
          },
        ],

        volume: {
          ...workoutData.volume,
          totalVolume: {
            ...workoutData.volume.totalVolume,

            lbs:
              workoutData.volume.totalVolume.lbs +
              +parseFloat(sets * reps * lbs).toFixed(2),
            kg:
              workoutData.volume.totalVolume.kg +
              +parseFloat(sets * reps * kg).toFixed(2),

            sets: workoutData.volume.totalVolume.sets + parseInt(sets),
          },

          [target]: {
            ...workoutData.volume[target],
            lbs:
              workoutData.volume[target].lbs +
              +parseFloat(sets * reps * lbs).toFixed(2),
            kg:
              workoutData.volume[target].kg +
              +parseFloat(sets * reps * kg).toFixed(2),
            sets: workoutData.volume[target].sets + parseInt(sets),
            reps:
              workoutData.volume[target].reps + parseInt(reps) * parseInt(sets),
          },
        },

        sets: workoutData.sets + parseInt(sets),
        reps: workoutData.reps + parseInt(reps) * parseInt(sets),
      })
    }
  }

  return (
    <Container maxWidth="lg">
      <h2>Add Workout</h2>
      <UnitFilter filter={filterUnit} />

      <div className="add-workout__form-wrapper">
        <TextField
          label="Optional Title"
          value={workoutData.title}
          variant="standard"
          onChange={(e) =>
            setWorkoutData({
              ...workoutData,
              title: e.target.value,
            })
          }
        />

        <div className="add-workout__date-wrapper">
          <label>Date</label>
          <DatePicker
            selected={workoutData.date}
            onChange={(date) =>
              setWorkoutData({
                ...workoutData,
                date,
                trainingWeek:
                  DateTime.fromJSDate(date)
                    .startOf('week')
                    .toFormat('dd LLL yy') +
                  ' - ' +
                  DateTime.fromJSDate(date).endOf('week').toFormat('dd LLL yy'),

                weekStart: DateTime.fromJSDate(date)
                  .startOf('week')
                  .toISODate(),
                weekEnd: DateTime.fromJSDate(date).endOf('week').toISODate(),
                dateString:
                  DateTime.fromJSDate(date).toLocaleString(dateFormat),
              })
            }
          />
        </div>

        <div className="add-workout__exercise-selection">
          <h4>Exercise Selection</h4>

          {favorites.length > 0 && (
            <Favorites favorites={favorites} callback={chooseExercise} />
          )}

          <ExerciseSelection
            searchFunction={searchExercise}
            filterFunction={filterExercise}
          />

          {workoutData.searchResults.length > 0 ? (
            <ExerciseList
              exercises={workoutData.searchResults}
              callback={chooseExercise}
              exerciseQuery={exerciseQuery}
              loading={loading}
              label={`Results for ${exerciseQuery}`}
            />
          ) : (
            exerciseQuery &&
            !loading && <h5>No Exercises Turned Up for {exerciseQuery}</h5>
          )}
        </div>

        {workoutData.currentExercise.name ? (
          <Lift
            exercise={workoutData.currentExercise}
            callback={addSet}
            getFavorites={getFavorites}
            addToFavorites={addToFavorites}
            removeFromFavorites={removeFromFavorites}
            unit={unit}
            userEmail={userEmail}
          />
        ) : (
          <div>
            <h5>Select an exercise from the filter options!</h5>
          </div>
        )}
      </div>

      {workoutData.totalSets.length > 0 && (
        <WorkoutList
          sets={workoutData.totalSets}
          callback={removeLift}
          enableRemove={true}
          unit={unit}
        />
      )}

      {workoutData.totalSets.length > 0 && (
        <button onClick={() => setOpenModal(true)}>Add Workout</button>
      )}

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyles}>
          <h4>Looking Good?</h4>
          <WorkoutList
            sets={workoutData.totalSets}
            enableRemove={false}
            unit={unit}
          />
          <Button variant="contained" onClick={handleSubmit} className="button">
            Add Workout
          </Button>
          <Button
            variant="contained"
            className="button btn-red"
            onClick={handleCloseModal}>
            No, I need to change something
          </Button>
        </Box>
      </Modal>
    </Container>
  )
}

export default AddWorkout
