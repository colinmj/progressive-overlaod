import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { Button, Select, MenuItem } from '@mui/material'

const NavBar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    history.push('/login')
    setUser(null)
  }

  const onSubmitMetric = (metric) => {
    localStorage.setItem('metric', metric)
  }

  useEffect(() => {
    const token = user?.token

    setUser(JSON.parse(localStorage.getItem('profile')))
  }, [location, user?.token])

  return (
    <>
      {user && (
        <header id="util-nav">
          <Link to="/add-workout">Add Workout</Link>
          <Link to="/exercise-library">Exercise Library</Link>
        </header>
      )}

      <header id="main-nav">
        <Link to="/">
          <h2>Progressive Overload</h2>
        </Link>

        <div className="user-info">
          {user && (
            <div>
              <label>Preferred Unit</label>
              <Select
                defaultValue={
                  localStorage.getItem('metric')
                    ? localStorage.getItem('metric')
                    : 'lbs'
                }
                onChange={(e) => onSubmitMetric(e.target.value)}
                style={{ minWidth: 75 }}>
                <MenuItem value="lbs">Lbs</MenuItem>
                <MenuItem value="kg">Kg</MenuItem>
              </Select>
            </div>
          )}

          {user ? (
            <div>
              <h4>
                {user.result.name
                  .split(' ')
                  .map((el) => el.charAt(0))
                  .join('')}
              </h4>
              <Button onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div>
              <Link to="/login">Sign In</Link>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default NavBar
