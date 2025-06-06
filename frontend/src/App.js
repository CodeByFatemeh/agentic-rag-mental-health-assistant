import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute'
/**
 * Main application with routing.
 */
const App = () => {
    return (_jsxs(Box, { sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh' }, children: [_jsx(Header, {}), _jsx(Box, { sx: { flexGrow: 1 }, children: _jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(Home, {}) }), _jsx(Route, { path: '/login', element: _jsx(Login, {}) }), _jsx(Route, { path: '/signup', element: _jsx(Signup, {}) }), _jsx(Route, { path: '/chat', element: _jsx(Chat, {}) }), _jsx(Route, { path: '*', element: _jsx(NotFound, {}) })] }) }), _jsx(Footer, {})] }));
};
export default App;
