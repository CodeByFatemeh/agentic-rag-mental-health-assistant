import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Typography, Button, Container, styled, useTheme, Grid2 } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroImage from '../assets/img/hero.jpg';
import styles from './Home.module.scss';
const StyledFeatureBox = styled('div')(({ theme }) => ({
    minHeight: '120px',
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    textAlign: 'center',
    margin: theme.spacing(1)
}));
const Home = () => {
    const navigate = useNavigate();
    const auth = useAuth();
    const location = useLocation();
    const theme = useTheme();
    const handleChatNowClick = () => {
        if (auth.isLoggedIn) {
            navigate('/chat');
        }
        else {
            navigate('/login', { state: { from: location } });
        }
    };
    return (_jsxs("div", { children: [_jsxs("div", { className: styles.heroSection, children: [_jsx("div", { className: styles.heroOverlay, children: _jsxs("div", { className: styles.heroContent, children: [_jsx(Typography, { variant: 'h3', component: 'h1', sx: { color: theme.palette.text.primary }, children: "Welcome to MindEase" }), _jsx(Typography, { variant: 'h6', sx: { color: theme.palette.text.secondary }, children: "Your AI-Powered Mental Wellness Companion" }), _jsx(Typography, { variant: 'body1', sx: { color: theme.palette.text.secondary }, children: "Talk to our intelligent chatbot for support, self-care tips, and resources to help you navigate life's challenges." }), _jsx(Button, { variant: 'contained', color: 'primary', size: 'large', sx: { mt: 2 }, onClick: handleChatNowClick, children: "Chat Now" })] }) }), _jsx("img", { src: HeroImage, alt: 'Chatbot illustration', className: styles.heroImage })] }), _jsxs(Container, { component: 'main', maxWidth: 'xl', sx: { mt: 8, mb: 8, flexGrow: 1 }, children: [_jsx(Typography, { variant: 'h4', component: 'h2', gutterBottom: true, sx: { textAlign: 'center' }, children: "Key Features" }), _jsxs(Grid2, { container: true, spacing: 4, justifyContent: 'center', sx: { mt: 8, mb: 8, flexGrow: 1, px: { xs: 2, md: 4 } }, children: [_jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: 'h5', component: 'h3', gutterBottom: true, children: "Personalized Support" }), _jsx(Typography, { variant: 'body2', children: "Get tailored advice and resources based on your specific needs." })] }) }), _jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: 'h5', component: 'h3', gutterBottom: true, children: "24/7 Availability" }), _jsx(Typography, { variant: 'body2', children: "Our chatbot is here for you anytime, day or night." })] }) }), _jsx(Grid2, { size: { xs: 12, sm: 6, md: 4 }, children: _jsxs(StyledFeatureBox, { children: [_jsx(Typography, { variant: 'h5', component: 'h3', gutterBottom: true, children: "Confidential & Secure" }), _jsx(Typography, { variant: 'body2', children: "Your conversations are private and protected." })] }) })] })] })] }));
};
export default Home;
