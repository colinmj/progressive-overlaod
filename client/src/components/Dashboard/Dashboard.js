import React, { useState, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { DateTime } from 'luxon'
import DatePicker from 'react-datepicker'
import { Container, Modal, Box } from '@mui/material'

import 'react-datepicker/dist/react-datepicker.css'

//actions
import { getTrainingWeeks } from '../../actions/trainingWeeks'
import { getWorkoutsByDate } from '../../actions/workouts'
import { getFavorites } from '../../actions/favorites'

//components
import LineChart from '../Chart/LineChart'
import VolumeFilter from './VolumeFilter'
import UnitFilter from './UnitFilter'
import DataFilter from './DataFilter'
import ViewFilter from './ViewFilter'
import Metrics from './Metrics'

//helpers
import {
  elSortino,
  calculateGrowthRate,
  calculateAverage,
  calculateTotal,
  upperFirst,
  formateZeDate,
} from '../../utils'

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

const Dashboard = () => {
  //state
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))
  const [unit, setUnit] = useState(
    localStorage.getItem('metric') ? localStorage.getItem('metric') : 'lbs'
  )
  const [view, setView] = useState(
    localStorage.getItem('view')
      ? localStorage.getItem('view')
      : 'training-weeks'
  )
  const [exercise, setExercise] = useState(
    localStorage.getItem('exercise') ? localStorage.getItem('exercise') : ''
  )
  const [dataset, setDataset] = useState('volume')
  const [openModal, setOpenModal] = useState(false)
  const [target, setTarget] = useState(
    localStorage.getItem('target')
      ? localStorage.getItem('target')
      : 'totalVolume'
  )
  const [rateOfGrowth, setRateOfGrowth] = useState(0)
  const [allVolume, setAllVolume] = useState(0)
  const [averageVolume, setAverageVolume] = useState(0)
  const [chartData, setChartData] = useState({
    data: {},
    target: 'totalVolume',
  })
  const [dates, setDates] = useState({
    startDate: localStorage.getItem('startDate')
      ? new Date(localStorage.getItem('startDate'))
      : DateTime.now().plus({ months: -3 }).startOf('day').toJSDate(),
    endDate: localStorage.getItem('endDate')
      ? new Date(localStorage.getItem('endDate'))
      : DateTime.now().endOf('week').startOf('day').toJSDate(),
  })

  let trainingWeeks = []
  let workouts = []
  let favorites = []

  const userEmail = user.result.email
  const { startDate, endDate } = dates
  const dispatch = useDispatch()

  //dispatch el training weeks
  useEffect(() => {
    dispatch(
      getTrainingWeeks(
        { user: userEmail },
        DateTime.fromJSDate(startDate).plus({ days: -1 }).startOf('day'),
        DateTime.fromJSDate(endDate).endOf('week').startOf('day')
      )
    )
  }, [dispatch, userEmail, startDate, endDate])

  //dispatch el workouts
  useEffect(() => {
    let exc = exercise ? exercise : ''

    dispatch(
      getWorkoutsByDate(
        { user: userEmail },
        DateTime.fromJSDate(startDate).startOf('day'),
        DateTime.fromJSDate(endDate).startOf('day'),
        exc
      )
    )

    displayWorkouts()
  }, [dispatch, userEmail, startDate, endDate, exercise])

  //dispatch el favoritos
  useEffect(() => {
    dispatch(
      getFavorites({
        user: userEmail,
      })
    )
  }, [dispatch, userEmail])

  //data from the database
  trainingWeeks = useSelector((state) => state.trainingWeeks)
  workouts = useSelector((state) => state.workouts)
  favorites = useSelector((state) => state.favorites)

  if (!Array.isArray(trainingWeeks)) {
    trainingWeeks = [trainingWeeks]
  }

  if (!Array.isArray(workouts)) {
    workouts = [workouts]
  }

  if (!Array.isArray(favorites)) {
    favorites = [favorites]
  }

  //sorting el data
  elSortino(trainingWeeks, 'weekStart')
  elSortino(workouts, 'date')

  //lets display the chart data if any of these things change
  useEffect(() => {
    if (view === 'workouts') {
      displayWorkouts()
    } else {
      displayTrainingWeeks()
    }
  }, [trainingWeeks, workouts, unit, view, dataset, target])

  const filterUnit = (value) => {
    setUnit(value)
  }

  const filterMuscle = (trg) => {
    localStorage.setItem('target', trg)
    setTarget(trg)
  }

  const renderTargetData = (d) => {
    return d === 'volume' ? unit : 'sets'
  }

  const changeDataset = (val) => {
    setDataset(val)
  }

  //close modal
  const handleCloseModal = () => setOpenModal(false)

  const assignData = (data) => {
    if (data.length > 0) {
      setRateOfGrowth(calculateGrowthRate(data))
      setAllVolume(calculateTotal(data))
      setAverageVolume(calculateAverage(data))
    }
  }

  //adjust chart data to display training weeks
  const displayTrainingWeeks = () => {
    trainingWeeks = trainingWeeks.filter((w) => w[target][unit] > 0)

    const trainingWeekVolume = trainingWeeks.map(
      (w) => w[target][renderTargetData(dataset)]
    )
    trainingWeekVolume.length > 0 && assignData(trainingWeekVolume)

    trainingWeekVolume &&
      setChartData({
        ...chartData,
        data: {
          ...chartData.data,
          labels:
            trainingWeeks &&
            trainingWeeks.map((week) => formateZeDate(week.weekStart)),
          ids: trainingWeeks && trainingWeeks.map((week) => week._id),
          datasets: [
            ...chartData.data.datasets,
            {
              label: '',
              id: trainingWeeks.map((week) => week._id),
              data: trainingWeeks.map(
                (week) => week[target][renderTargetData(dataset)]
              ),
              fill: false,
              borderColor: '#1779e3',
              tension: 0.1,
            },
          ],
        },
      })
  }

  //adjust chart data to display workouts
  const displayWorkouts = () => {
    workouts = workouts.filter((w) => w.volume[target][unit] > 0)
    const workoutVolume = workouts.map(
      (w) => w.volume[target][renderTargetData(dataset)]
    )

    let queriedLifts = exercise
      ? workouts.map((w) =>
          w.totalSets
            .filter((set) => set.exercise === exercise)
            .map((w) => w.volume.totalVolume[renderTargetData(dataset)])
            .reduce((a, b) => a + b, 0)
        )
      : null

    if (exercise) {
      queriedLifts.length > 0 && assignData(queriedLifts)
    } else {
      workoutVolume.length > 0 && assignData(workoutVolume)
    }

    setChartData({
      ...chartData,
      data: {
        ...chartData.data,
        labels:
          workouts && workouts.map((workout) => formateZeDate(workout.date)),
        ids: workouts && workouts.map((workout) => workout._id),
        datasets: [
          ...chartData.data.datasets,
          {
            label: '',
            id: workouts.map((workout) => workout._id),
            data: exercise
              ? queriedLifts
              : workouts.map(
                  (workout) => workout.volume[target][renderTargetData(dataset)]
                ),
            fill: false,
            borderColor: '#1779e3',
            tension: 0.1,
          },
        ],
      },
    })
  }

  const dispatchStartDate = (startDate) => {
    localStorage.setItem('startDate', startDate)

    setDates({
      ...dates,
      startDate,
    })
  }

  const dispatchEndDate = (endDate) => {
    localStorage.setItem('endDate', endDate)

    setDates({
      ...dates,
      endDate,
    })
  }

  //filter between training weeks, workouts, and individual exercises
  const changeView = (val) => {
    if (val === 'training-weeks') {
      localStorage.setItem('view', 'training-weeks')
      localStorage.setItem('exercise', '')

      setView('training-weeks')
      setExercise('')
      displayTrainingWeeks()
    } else if (val === 'workouts') {
      localStorage.setItem('view', 'workouts')
      localStorage.setItem('exercise', '')

      setView('workouts')
      setExercise('')
      dispatch(
        getWorkoutsByDate(
          { user: userEmail },
          DateTime.fromJSDate(startDate).plus({ days: -1 }),
          DateTime.fromJSDate(endDate).endOf('week')
        )
      )

      displayWorkouts()
    } else {
      setTarget('totalVolume')
      setOpenModal(true)
    }
  }

  //choose an exercise from your list of favorites from that sweet, sweet modal
  const onExerciseSubmit = (exc) => {
    handleCloseModal()
    localStorage.setItem('exercise', exc.trim())
    setExercise(exc.trim())
    setView('workouts')
    dispatch(
      getWorkoutsByDate(
        { user: userEmail },
        DateTime.fromJSDate(startDate).plus({ days: -1 }),
        DateTime.fromJSDate(endDate),
        exc
      )
    )

    displayWorkouts()
  }

  const { data } = chartData

  return (
    <Container maxWidth="xl">
      <Metrics
        rateOfGrowth={rateOfGrowth}
        allVolume={allVolume}
        averageVolume={averageVolume}
        view={view}
        unit={unit}
        target={target}
        exercise={exercise}
        dataset={dataset}
        startDate={startDate}
        endDate={endDate}
      />

      <section className="dashboard-filters">
        <ViewFilter
          hasFavorites={favorites.length > 0}
          filter={changeView}
          exercise={exercise}
        />

        <form>
          <label>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(startDate) => dispatchStartDate(startDate)}
          />
        </form>

        <form>
          <label>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(endDate) => dispatchEndDate(endDate)}
          />
        </form>

        {exercise === '' && <VolumeFilter filter={filterMuscle} />}
        <UnitFilter filter={filterUnit} />
        <DataFilter filter={changeDataset} />

        {exercise && (
          <button className="button" onClick={() => setOpenModal(true)}>
            Change Exercise
          </button>
        )}
      </section>

      <LineChart data={data} urlParam={view} unit={unit} dataset={dataset} />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={modalStyles}>
          <ul className="po__dashboard-exercises">
            {favorites &&
              favorites.map((fav) => (
                <li key={fav}>
                  <button onClick={() => onExerciseSubmit(fav.name)}>
                    {upperFirst(fav.name)}
                  </button>
                </li>
              ))}
          </ul>
        </Box>
      </Modal>
    </Container>
  )
}

export default Dashboard
