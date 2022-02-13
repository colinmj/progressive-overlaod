import React from 'react'
import loaderImg from '../img/Hourglass.gif'

export default function Loader() {
  return (
    <div
      id="el-loader"
      style={{ textAlign: 'center', paddingTop: 30, height: '100vh' }}>
      <img src={loaderImg} alt="a hype loading hourglass" />
    </div>
  )
}
