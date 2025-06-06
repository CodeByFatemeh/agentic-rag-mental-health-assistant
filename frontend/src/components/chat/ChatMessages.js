import { jsx as _jsx } from "react/jsx-runtime";
import { Box } from '@mui/material';
import { ChatItem } from './ChatItem';
export const ChatMessages = ({ messages }) => (_jsx(Box, { sx: {
        flexGrow: 1,
        overflowY: 'auto',
        mb: 2,
        p: { xs: 1, sm: 2 },
        border: '1px solid #ddd',
        borderRadius: 1,
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
    }, children: messages.map((msg) => {
        var _a;
        return (_jsx(ChatItem, { message: msg }, (_a = msg._id) !== null && _a !== void 0 ? _a : `${msg.role}-${msg.content}-${Math.random()}`));
    }) }));
