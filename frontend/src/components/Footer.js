import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, useTheme } from '@mui/material';
const Footer = () => {
    const theme = useTheme();
    const linkColor = theme.palette.primary.main;
    return (_jsx(Box, { component: 'footer', sx: {
            py: 3,
            px: 2,
            mt: 'auto',
        }, children: _jsxs(Typography, { variant: 'body2', align: 'center', color: 'softGray.main', children: ["\u00A9 ", new Date().getFullYear(), ' ', _jsx("span", { style: { fontWeight: 600 }, children: "MindEase" }), " by", ' ', _jsx("a", { href: 'https://www.linkedin.com/in/fatemeh-frontend-dev', color: linkColor, 
                    // underline="hover"
                    target: '_blank', rel: 'noopener noreferrer', style: { color: linkColor, textDecoration: 'none' }, children: "Fatemeh Telgerdi" })] }) }));
};
export default Footer;
