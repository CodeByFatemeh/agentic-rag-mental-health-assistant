import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Button, Container, styled, Grid2, Box, useTheme, } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import heroImage from '../assets/img/hero.jpg';
import styles from './Home.module.scss';
import { Chat as ChatIcon } from '@mui/icons-material';
import React, { useCallback } from 'react';
const StyledFeatureBox = styled(Box)(({ theme }) => ({
    minHeight: '120px',
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(2),
    textAlign: 'center',
    margin: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
    },
}));
/**
 * Home page with hero and features sections.
 */
const Home = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const location = useLocation();
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const handleChatNowClick = useCallback(() => {
        try {
            navigate(isLoggedIn ? '/chat' : '/login', { state: { from: location } });
        }
        catch (error) {
            console.error('Navigation failed:', error);
        }
    }, [isLoggedIn, navigate, location]);
    return (_jsxs(Box, { children: [_jsxs(Box, { className: styles.heroSection, children: [_jsx(Box, { className: styles.heroOverlay, sx: {
                            backgroundColor: isDarkMode
                                ? 'rgba(130, 122, 122, 0.7)'
                                : 'rgba(127, 120, 120, 0.05)',
                        }, children: _jsxs(Box, { className: styles.heroContent, children: [_jsx(Typography, { variant: "h3", component: "h1", gutterBottom: true, "aria-label": "Welcome to MindEase", children: "Welcome to MindEase" }), _jsx(Typography, { variant: "h6", gutterBottom: true, children: "Your AI-Powered Mental Wellness Companion" }), _jsx(Typography, { variant: "body1", component: "p", gutterBottom: true, children: "Talk to our intelligent chatbot for support, self-care tips, and resources to help you navigate life's challenges." }), _jsx(Button, { variant: "contained", color: "primary", size: "large", sx: { mt: 2 }, onClick: handleChatNowClick, startIcon: _jsx(ChatIcon, {}), "aria-label": "Chat with MindEase", children: "Chat Now" })] }) }), _jsx("img", { src: heroImage, alt: "Chatbot illustration", className: styles.heroImage, loading: "lazy" })] }), _jsxs(Container, { component: "main", maxWidth: "xl", sx: { mt: 8, mb: 8, flexGrow: 1, padding: { xs: 2, sm: 3 } }, children: [_jsx(Typography, { variant: "h4", component: "h2", gutterBottom: true, sx: { textAlign: 'center' }, "aria-label": "Key Features", children: "Key Features" }), _jsxs(Grid2, { container: true, spacing: 4, sx: {
                            mt: 8,
                            mb: 8,
                            flexGrow: 1,
                            px: { xs: 2, md: 4 },
                        }, children: [_jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: "h5", component: "h3", gutterBottom: true, children: "Personalized Support" }), _jsx(Typography, { variant: "body2", children: "Get tailored advice and resources based on your specific needs." })] }) }), _jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: "h5", component: "h3", gutterBottom: true, children: "24/7 Availability" }), _jsx(Typography, { variant: "body2", children: "Our chatbot is here for you anytime, day or night." })] }) }), _jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: "h5", component: "h3", gutterBottom: true, children: "Confidential & Secure" }), _jsx(Typography, { variant: "body2", children: "Your conversations are private and protected." })] }) })] })] })] }));
};
export default React.memo(Home);
