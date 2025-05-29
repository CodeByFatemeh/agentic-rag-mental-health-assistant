import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function App () {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        {/* <Route path='/chat' element={<Chat />} /> */}
        <Route
          path='/chat'
          element={<ProtectedRoute requiresAuth={true} component={Chat} />}
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
