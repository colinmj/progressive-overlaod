import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { upperFirst, elSortino, formateZeDate } from '../../utils'
import Loader from '../Loader'
import { Container } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { getWorkouts } from '../../actions/workouts'
import { getTrainingWeek } from '../../actions/trainingWeeks'
import UnitFilter from '../Dashboard/UnitFilter'
import BarChart from '../Chart/BarChart'
import Donut from '../Chart/Donut'

const TrainingWeek = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))
  const [unit, setUnit] = useState( localStorage.getItem('metric') ? localStorage.getItem('metric') : 'lbs')
  const [isLoading, setisLoading] = useState(true)
  const [chartData, setChartData] = useState({
    data: {},
  })
  const [muscleVolume, setMuscleVolume] = useState([])
  const [donutData, setDonutData] = useState({
    data: {},
  })
  const [view, setView] = useState('workouts')

  const { id } = useParams()
  const userEmail = user.result.email

  const dispatch = useDispatch()

  const filterUnit = (value) => {
    setUnit(value)
  }

  //get training week from slug
  useEffect(() => {
    dispatch(getTrainingWeek({ id }))
  }, [dispatch, id])

  const trainingWeek = useSelector((state) => state.trainingWeeks)


  console.log(trainingWeek)

  //get corresponding workouts
  useEffect(() => {
    dispatch(getWorkouts({ user: userEmail, trainingWeek: trainingWeek.title }))
  }, [dispatch, userEmail, trainingWeek])

  let workouts = useSelector((state) => state.workouts)

  if (!Array.isArray(workouts)) {
    workouts = [workouts]
  }

  //sort by week
  elSortino(workouts, 'date')

  useEffect(() => {
    setChartData({
      data: {
        labels: workouts.map((workout) => formateZeDate(workout.date)),
        datasets: [
          {
            label: 'Volume',
            data:
              workouts &&
              workouts.map((workout) => workout.volume.totalVolume[unit]),
            id: workouts && workouts.map((workout) => workout._id),
            backgroundColor: ['#1779e3', '#8cbef5'],
          },
        ],
      },
    })
  }, [workouts, unit])

  useEffect(() => {
    const muscleGroups = Object.entries(trainingWeek).filter(
      (group) =>
        group[0] !== 'totalVolume' &&
        typeof group[1] == 'object' &&
        group[1].hasOwnProperty('sets') &&
        group[1].sets > 0
    )

    muscleGroups.length && setMuscleVolume(muscleGroups)
  }, [trainingWeek])

  useEffect(() => {
    setDonutData({
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

  useEffect(() => {
    if (workouts.length && trainingWeek.totalVolume) {
      setisLoading(false)
    }
  }, [workouts, trainingWeek])

  const { data } = chartData


  console.log(muscleVolume)

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Container maxWidth="md">
          <section className="po__training-week">
            <div className="training-week-data">
              <h3>Training Week : {trainingWeek && trainingWeek.title}</h3>
              <div>
                <h4>
                  Total Volume:{' '}
                  {trainingWeek &&
                    trainingWeek.totalVolume &&
                    trainingWeek.totalVolume[unit] &&
                    trainingWeek.totalVolume[unit].toLocaleString('en')}{' '}
                  {unit}
                </h4>
                <UnitFilter filter={filterUnit} />
              </div>

              {muscleVolume.length &&

            

                muscleVolume.map((group) => (
                  <ul key={group[0]}>
                    <li>
                      {upperFirst(group[0])} :{' '}
                      {group[1][unit].toLocaleString('en')} {unit},{' '}
                      {group[1].sets} sets
                    </li>
                  </ul>
                ))}
            </div>
            <div>
              <ul className="po__view-toggle">
                <li className={view === 'workouts' ? 'active' : ''}>
                  <button onClick={() => setView('workouts')}>
                    Workout View
                  </button>
                </li>
                <li className={view === 'volume' ? 'active' : ''}>
                  <button onClick={() => setView('volume')}>Volume View</button>
                </li>
              </ul>
            </div>
          </section>

          {view === 'workouts' ? (
            <BarChart data={data} urlParam="workouts" unit={unit} />
          ) : (
            <Donut data={donutData.data} unit={unit} />
          )}
        </Container>
      )}
    </>
  )
}

export default TrainingWeek
