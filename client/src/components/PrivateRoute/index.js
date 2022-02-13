import React, { useState } from 'react'
import { Redirect, Route } from 'react-router-dom'

export const PrivateRoute = ({ component: Component, ...rest }) => {
  const [user] = useState(JSON.parse(localStorage.getItem('profile')))

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          <Component key={props.match.params.id || 'empty'} {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  )
}
