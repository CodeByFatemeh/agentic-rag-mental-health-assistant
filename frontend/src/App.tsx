import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * Main application with routing.
 */
const App: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path='/chat' element={<Chat />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Box>
      <Footer />
    </Box>
  )
}

export default App
