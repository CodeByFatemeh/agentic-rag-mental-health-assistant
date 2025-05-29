import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsxs(Routes, { children: [_jsx(Route, { path: '/', element: _jsx(Home, {}) }), _jsx(Route, { path: '/login', element: _jsx(Login, {}) }), _jsx(Route, { path: '/signup', element: _jsx(SignUp, {}) }), _jsx(Route, { path: '/chat', element: _jsx(ProtectedRoute, { requiresAuth: true, component: Chat }) }), _jsx(Route, { path: '*', element: _jsx(NotFound, {}) })] }), _jsx(Footer, {})] }));
}
export default App;
