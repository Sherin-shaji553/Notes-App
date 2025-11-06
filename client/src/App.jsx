
import  Navbar  from './component/Navbar'
import './App.css'
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import axios from 'axios'


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // console.log(user)

  useEffect(()=>{
    const fetchUser = async ()=>{
      try{
        const token = localStorage.getItem("token")
        if(!token) return;
        
        const {data} = await axios.get('/api/users/loggedUser', {
          headers : {Authorization : `Bearer ${token}`}
        })
        setUser(data)
      }catch(err){
        localStorage.removeItem("token",err)
      } finally{
        setLoading(false)
      }
    }
    fetchUser()
  },[])

  //loading
  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
}



  return (
    <div className='min-h-screen bg-gray-500'>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path='/login' element={user? <Navigate to='/'/> : <Login setUser={setUser}/>} />
        <Route path='/register' element={user? <Navigate to='/'/> : <Register setUser={setUser} /> } />
        <Route path='/' element={user? <HomePage/> : <Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
