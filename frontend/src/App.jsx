import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import { useAuthStore } from './store/useAuthStore'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const {authUser, checkAuth, isCheckingAuth, onlineUsers} = useAuthStore()
  const {theme} = useThemeStore()

  console.log({onlineUsers});

  useEffect(() => {
    checkAuth()
  }, [ checkAuth ])

  console.log({authUser});

  if(isCheckingAuth && !authUser) return (
    // loading spinner
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600'>
        </div>
      </div>

  )

  return (
    <div data-theme={theme}>

      <Navbar />

      <Routes>
        <Route path='/' element={authUser ? <HomePage/> : <Navigate to='/login'/>}/>
        <Route path='/signup' element={!authUser ? <SignUpPage/> : <Navigate to='/'/>}/>
        <Route path='/login' element={ !authUser ? <LoginPage/> : <Navigate to='/'/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={ authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>

      </Routes>

      <Toaster/>
    </div>
  )
}

export default App