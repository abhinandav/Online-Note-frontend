import { lazy, useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './Pages/User/Login';
import Register from './Pages/User/Register';
import UserRoute from './components/route/UserRoute';
import AllNotes from './components/user/AllNotes';



const Home = lazy(() => import('./Pages/User/Home'));


function App() {
  return (
    <>
<ToastContainer
  position="top-center"
  autoClose={3000}
  limit={2}
  hideProgressBar={false}
  newestOnTop
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  transition={{ bounce: 'bounce' }} // Correct syntax for the transition prop
/>

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/all_notes" element={<AllNotes />} />
          <Route path="/" element={<UserRoute><Home /></UserRoute>} />
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
