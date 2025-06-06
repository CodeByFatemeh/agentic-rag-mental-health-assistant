import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
/**
 * 404 Not Found page.
 */
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsxs(Container, { maxWidth: "md", sx: { textAlign: 'center', mt: 8 }, children: [_jsx(Typography, { variant: "h4", gutterBottom: true, children: "Page Not Found" }), _jsx(Typography, { variant: "body1", color: "text.secondary", paragraph: true, children: "The page you're looking for doesn't exist." }), _jsx(Button, { variant: "contained", onClick: () => navigate('/'), "aria-label": "Go to home", children: "Go to Home" })] }));
};
export default NotFound;
