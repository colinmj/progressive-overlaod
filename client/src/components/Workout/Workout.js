import React, { useState, useEffect } from 'react'
import { Modal, Box, Button } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from '@mui/material'
import { getWorkout, deleteWorkout } from '../../actions/workouts'
import WorkoutList from './WorkoutList'
import Loader from '../Loader'
import UnitFilter from '../Dashboard/UnitFilter'
import Donut from '../Chart/Donut'
import { VolumeList } from './VolumeList'
import { upperFirst } from '../../utils'

export const Workout = () => {
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setisLoading] = useState(true)
  const [unit, setUnit] = useState('lbs')
  const [muscleVolume, setMuscleVolume] = useState([])
  const [liftVolume, setLiftVolume] = useState([])
  const [view, setView] = useState('list')
  const [workoutData, setWorkoutData] = useState({
    date: '',
    title: '',
    totalSets: [],
    volume: {},
    lifts: [],
  })
  const [donutMuscleData, setDonutMuscleData] = useState({
    data: {},
  })

  const [donutLiftData, setDonutLiftData] = useState({
    data: {},
  })

  const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  }

  let workout
  const id = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getWorkout(id))
  }, [id, dispatch])

  workout = useSelector((state) => state.workouts)

  const onDeleteWorkout = () => {
    dispatch(deleteWorkout(id))
    window.location.href = '/'
  }

  useEffect(() => {
    if (workout && muscleVolume.length > 0 && liftVolume.length > 0) {
      setisLoading(false)
    }
  }, [workout, muscleVolume, liftVolume])

  useEffect(() => {
    setWorkoutData({
      date: workout.date,
      title: workout.title,
      totalSets: workout.totalSets,
      volume: workout.volume,
      dateString: workout.dateString,
    })
  }, [workout])

  const handleCloseModal = () => setOpenModal(false)

  const filterUnit = (value) => {
    setUnit(value)
  }

  //I feel that this could be optimized, come back to this later
  const createLiftData = (data) => {
    let liftData = []

    data &&
      data.forEach((item) => {
        if (liftData.find((el) => el.exercise === upperFirst(item.exercise))) {
          let theIndex = liftData.findIndex(
            (el) => el.exercise === upperFirst(item.exercise)
          )

          liftData[theIndex].volume.lbs += item.volume.totalVolume.lbs
          liftData[theIndex].volume.kg += item.volume.totalVolume.kg
          liftData[theIndex].volume.sets += item.volume.totalVolume.sets
        } else {
          liftData.push({
            exercise: upperFirst(item.exercise),
            volume: item.volume.totalVolume,
          })
        }
      })

    return liftData
  }

  //prepare data for muscle target chart
  useEffect(() => {
    const muscleGroups =
      workoutData &&
      workoutData.volume &&
      Object.entries(workoutData.volume).filter(
        (group) =>
          group[0] !== 'totalVolume' &&
          typeof group[1] == 'object' &&
          group[1].hasOwnProperty('sets') &&
          group[1].sets > 0
      )

    muscleGroups && muscleGroups.length > 0 && setMuscleVolume(muscleGroups)
  }, [workoutData])

  //prepare data for lift target chart
  useEffect(() => {
    const liftGroups = createLiftData(workoutData.totalSets)

    liftGroups && liftGroups.length > 0 && setLiftVolume(liftGroups)
  }, [workoutData])

  //build chart data for muscle groups
  useEffect(() => {
    setDonutMuscleData({
      data: {
        labels: muscleVolume.map((m) => upperFirst(m[0])),
        datasets: [
          {
            label: 'Volume by muscle',
            backgroundColor: [
              '#1779e3',
              '#8cbef5',
              '#f19df2',
              '#f2f19d',
              '#996aba',
              '#f79205',
              '#33b82c',
              '#064f63',
              '#250663',
              '#40705c',
            ],
            data: muscleVolume.map((m) => m[1][unit]),
          },
        ],
      },
    })
  }, [muscleVolume, unit])

  //build chart data for lift groups
  useEffect(() => {
    setDonutLiftData({
      data: {
        labels: liftVolume.map((l) => l.exercise),
        datasets: [
          {
            label: 'Volume by Lift',
            backgroundColor: [
              '#1779e3',
              '#8cbef5',
              '#f19df2',
              '#f2f19d',
              '#996aba',
              '#f79205',
              '#33b82c',
              '#064f63',
              '#250663',
              '#40705c',
            ],
            data: liftVolume.map((l) => l.volume[unit]),
          },
        ],
      },
    })
  }, [liftVolume, unit])

  const { dateString, totalSets, title } = workoutData

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container maxWidth="lg" className="po__workout-view">
          <div className="workout-data">
            <div>
              {title ? (
                <h4>
                  {title} - {dateString}
                </h4>
              ) : (
                <h4>{dateString}</h4>
              )}
              <UnitFilter filter={filterUnit} />
            </div>

            <ul className="po__view-toggle">
              <li className={view === 'list' ? 'active' : ''}>
                <button onClick={() => setView('list')}>List View</button>
              </li>
              <li className={view === 'chart' ? 'active' : ''}>
                <button onClick={() => setView('chart')}>Chart View</button>
              </li>
            </ul>
          </div>

          {view === 'list' ? (
            <div>
              <VolumeList data={workoutData} unit={unit} />
              {totalSets && <WorkoutList sets={totalSets} unit={unit} />}
            </div>
          ) : (
            <div className="po__workout-chart-view">
              <div>
                <label>By Muscle Group</label>
                <Donut data={donutMuscleData.data} unit={unit} />
              </div>

              <div>
                <label>By Lift </label>
                <Donut data={donutLiftData.data} unit={unit} />
              </div>
            </div>
          )}

          <Button variant="contained" onClick={() => setOpenModal(true)}>
            Delete Workout
          </Button>

          <Modal open={openModal} onClose={handleCloseModal}>
            <Box sx={modalStyles}>
              <h4>Are you sure?</h4>
              <p>This action cannot be undone</p>
              <Button onClick={onDeleteWorkout}>Delete Workout</Button>
            </Box>
          </Modal>
        </Container>
      )}
    </>
  )
}

export default Workout
