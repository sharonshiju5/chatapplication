import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/login'
import CreateUser from './components/register'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from './components/home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/register' Component={CreateUser}/>
          <Route path='/login' Component={Login}/>
          <Route path='/' Component={HomePage}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
