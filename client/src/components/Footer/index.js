import React from 'react'
import { Container } from '@mui/material'

const Footer = () => {
  return (
    <Container
      className="po__footer"
      maxWidth="xl"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <p>Progressive Overload</p>
      <a href="mailto:cmatsonjones@gmail.com">Contact </a>
    </Container>
  )
}

export default Footer
