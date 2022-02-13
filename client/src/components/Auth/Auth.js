import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { createUser } from '../../actions/users'

import { Avatar, Button, Container, Paper } from '@mui/material'
import { GoogleLogin } from 'react-google-login'
import LockIcon from '@mui/icons-material/Lock'
import Input from './Input'
import Icon from './icon'

export const Auth = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()

  const handleSubmit = () => {}
  const handleChange = () => {}
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }
  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => {
      return !prevIsSignUp
    })
    handleShowPassword(false)
  }

  const googleSuccess = async (res) => {
    const result = res?.profileObj
    const token = res?.tokenId

    try {
      dispatch({ type: 'AUTH', data: { result, token } })
      dispatch(createUser(result))
      history.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  const googleFailure = (e) => {
    console.log(e)
    console.log('Google sign in was unsuccessful')
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: 20 }}>
        <Avatar style={{ margin: '0 auto 30px auto' }}>
          <LockIcon />
        </Avatar>
        {/* <Typography variant="h5">{isSignUp ? "Sign Up" : "Sign In"}</Typography> */}
        <form onSubmit={handleSubmit}>
          {/* <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name="confirmPassword"
                label="Confirm Password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid> */}

          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_ID}
            render={(renderProps) => (
              <Button
                fullWidth
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
                startIcon={<Icon />}
                variant="contained">
                Sign In With Google
              </Button>
            )}
            onSuccess={googleSuccess}
            onFailure={googleFailure}
            cookiePolicy="single_host_origin"
          />

          {/* <Button type="submit" fullWidth variant="contained">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button> */}
          {/* <Grid container justify="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? "Already Have an account? Sign In."
                  : "Make an account!"}
              </Button>
            </Grid>
          </Grid> */}
        </form>
      </Paper>
    </Container>
  )
}
