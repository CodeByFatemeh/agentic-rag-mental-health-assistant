import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, TextField, Button } from '@mui/material';
export const ChatInput = ({ value, onChange, onSend, disabled }) => (_jsxs(Box, { sx: {
        display: 'flex',
        gap: 1,
        alignItems: 'center',
        flexWrap: 'wrap',
        p: { xs: 1, sm: 0 },
    }, children: [_jsx(TextField, { fullWidth: true, value: value, onChange: (e) => onChange(e.target.value), placeholder: "Type your message...", onKeyDown: (e) => e.key === 'Enter' && onSend(), disabled: disabled, "aria-label": "Chat input", sx: {
                flexGrow: 1,
                '& .MuiInputBase-root': { fontSize: 'clamp(0.875rem, 2vw, 1rem)' },
            } }), _jsx(Button, { variant: "contained", onClick: onSend, disabled: disabled, "aria-label": "Send message", sx: {
                flexShrink: 0,
                height: 'fit-content',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                px: 3,
            }, children: disabled ? 'Sending...' : 'Send' })] }));
