import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Box } from '@mui/material';
import { useChat } from '../../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatHistory } from './ChatHistory';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ClearChatDialog } from './ClearChatDialog';
const ChatContainer = () => {
    const [{ drawerOpen, confirmClear, sessions, sessionId, messages, input, loading }, actions] = useChat();
    return (_jsxs(Container, { maxWidth: false, disableGutters: true, sx: {
            height: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            p: { xs: 1, sm: 2 },
        }, children: [_jsx(ChatHistory, { sessions: sessions, currentSessionId: sessionId, onSelectSession: actions.handleSelectSession, onDeleteSession: actions.handleDeleteSession, isDrawerOpen: drawerOpen, onToggleDrawer: actions.toggleDrawer }), _jsxs(Box, { sx: {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minWidth: 0,
                    overflow: 'hidden',
                }, children: [_jsx(ChatHeader, { onNewChat: actions.handleNewChat, onClearChat: () => actions.setConfirmClear(true), onToggleDrawer: actions.toggleDrawer, loading: loading }), _jsx(ChatMessages, { messages: messages }), _jsx(ChatInput, { value: input, onChange: actions.setInput, onSend: actions.handleSend, disabled: loading || !input.trim() }), _jsx(ClearChatDialog, { open: confirmClear, onClose: () => actions.setConfirmClear(false), onConfirm: actions.handleDeleteChats })] })] }));
};
export default ChatContainer;
