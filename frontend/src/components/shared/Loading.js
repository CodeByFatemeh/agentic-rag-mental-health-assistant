import { jsx as _jsx } from "react/jsx-runtime";
import { Box, CircularProgress } from '@mui/material';
const Loading = () => (_jsx(Box, { sx: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    }, children: _jsx(CircularProgress, {}) }));
export default Loading;
