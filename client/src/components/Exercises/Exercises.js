import React, { useEffect, useState } from 'react'
import { upperFirst } from '../../utils'
import { Container, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import Loader from '../Loader'
import { GiWeightLiftingUp } from 'react-icons/gi'
import { fetchExercisesByTarget, fetchMuscles } from '../../api.js'

const Exercises = () => {
  const [targetList, setTargetList] = useState([])
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTarget, setActiveTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [targetLoading, setTargetLoading] = useState(false)

  useEffect(() => {
    setTargetLoading(true)
    fetchMuscles().then((res) => {
      setTargetLoading(false)
      setTargetList(res)
    })
  }, [])

  useEffect(() => {
    let elTarget = ''
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    if (urlParams.get('target')) {
      elTarget = urlParams.get('target')
    } else {
      elTarget = targetList[0]
    }

    setActiveTarget(elTarget)

    if (elTarget) {
      fetchExercises(elTarget)
    }
  }, [targetList])

  const fetchExercises = (target) => {
    setLoading(true)
    setSearchTerm('')
    setActiveTarget(target)

    fetchExercisesByTarget(target).then((res) => {
      setLoading(false)
      setExercises(res)
    })
  }

  return (
    <Container maxWidth="lg">
      <h1>Available Exercises</h1>

      {targetLoading ? (
        <Loader />
      ) : (
        targetList.length > 0 && (
          <ul id="el-nav">
            {targetList.map((part, i) => (
              <li key={i} className={part === activeTarget ? 'active' : ''}>
                <GiWeightLiftingUp />
                <button className="el-btn" onClick={() => fetchExercises(part)}>
                  {' '}
                  {upperFirst(part)}
                </button>
              </li>
            ))}
          </ul>
        )
      )}

      <div>
        <TextField
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        exercises.length > 0 && (
          <ul>
            {exercises
              .filter((e) =>
                e.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((exercise, i) => (
                <li key={i}>
                  <Link to={`/exercise/${exercise.id}`}>
                    {upperFirst(exercise.name)}{' '}
                  </Link>
                </li>
              ))}
          </ul>
        )
      )}
    </Container>
  )
}

export default Exercises
