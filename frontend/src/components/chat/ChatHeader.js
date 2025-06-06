import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
export const ChatHeader = ({ onNewChat, onClearChat, onToggleDrawer, loading }) => {
    var _a;
    const { user } = useAuth();
    return (_jsxs(Box, { sx: {
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1, sm: 2 },
            bgcolor: 'background.paper',
            borderBottom: '1px solid #ddd',
        }, children: [_jsxs(Box, { sx: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: { xs: 'wrap', sm: 'nowrap' },
                    gap: 1,
                    mb: 2,
                }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(HistoryIcon, {}), onClick: onToggleDrawer, sx: { display: { md: 'none' }, flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "View chat history", children: "History" }), _jsxs(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(AddIcon, {}), onClick: onNewChat, disabled: loading, sx: { flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "Start new chat", children: "New Chat" }), _jsx(Button, { variant: "outlined", color: "error", onClick: onClearChat, disabled: loading, sx: { flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "Delete chats", children: "Clear" })] })] }), _jsx(Typography, { variant: "h4", sx: { fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', mb: 1 }, children: "Chat with MindEase" }), _jsxs(Typography, { variant: "body1", sx: { fontSize: 'clamp(0.875rem, 2vw, 1rem)', mb: 2 }, children: ["Welcome, ", (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : 'User', "! How can I assist you today?"] })] }));
};
