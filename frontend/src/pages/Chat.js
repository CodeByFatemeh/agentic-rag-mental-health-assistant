import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, List, ListItem, ListItemText, Drawer, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { sendChatRequest, getUserChats, deleteUserChats, getChatSessions } from '../services/chat';
import { useAuth } from '../hooks/useAuth';
import { MESSAGE_SENT_SUCCESS, CHATS_LOADED_SUCCESS, CHATS_DELETED_SUCCESS } from '../utils/constants';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import moment from 'moment';
const Chat = () => {
    var _a;
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [sessionId, setSessionId] = useState(() => {
        const saved = localStorage.getItem('chatSessionId');
        if (saved)
            return saved;
        const newId = uuidv4();
        localStorage.setItem('chatSessionId', newId);
        return newId;
    });
    const [loading, setLoading] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [confirmClear, setConfirmClear] = useState(false);
    const fetchChats = async (id) => {
        if (!user)
            return;
        try {
            const response = await getUserChats(id);
            if (response.data) {
                setMessages(response.data);
                toast.success(CHATS_LOADED_SUCCESS);
            }
        }
        catch (error) {
            console.error('Error loading chats:', error);
            toast.error('Failed to load chats');
        }
    };
    useEffect(() => {
        fetchChats(sessionId);
    }, [sessionId, user]);
    useEffect(() => {
        const fetchSessions = async () => {
            if (!user)
                return;
            try {
                const response = await getChatSessions();
                setSessions(response.data);
            }
            catch (error) {
                console.error('Error loading sessions:', error);
            }
        };
        fetchSessions();
    }, [user]);
    const handleSend = async () => {
        if (!input.trim())
            return;
        setLoading(true);
        try {
            const response = await sendChatRequest(input, sessionId);
            if (response.data) {
                setMessages((prev) => [...prev, { role: 'user', content: input }, ...(response.data || [])]);
                toast.success(MESSAGE_SENT_SUCCESS);
                setInput('');
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
        finally {
            setLoading(false);
        }
    };
    const handleNewChat = () => {
        const newId = uuidv4();
        localStorage.setItem('chatSessionId', newId);
        setSessionId(newId);
        setMessages([]);
        toast.success('New chat started');
    };
    const handleDeleteChats = async () => {
        try {
            await deleteUserChats(sessionId);
            setMessages([]);
            localStorage.removeItem('chatSessionId');
            setSessionId(uuidv4());
            toast.success(CHATS_DELETED_SUCCESS);
            setConfirmClear(false);
        }
        catch (error) {
            console.error('Error deleting chats:', error);
            toast.error('Failed to delete chats');
        }
    };
    const handleSelectSession = async (id) => {
        localStorage.setItem('chatSessionId', id);
        setSessionId(id);
        await fetchChats(id);
        setDrawerOpen(false);
    };
    const handleDeleteSession = async (id) => {
        try {
            await deleteUserChats(id);
            setSessions((prev) => prev.filter((s) => s.sessionId !== id));
            if (id === sessionId) {
                handleNewChat();
            }
            toast.success('Session deleted');
        }
        catch (error) {
            console.error('Error deleting session:', error);
            toast.error('Failed to delete session');
        }
    };
    return (_jsxs(Container, { maxWidth: false, disableGutters: true, sx: {
            height: '100vh',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            overflow: 'hidden',
            p: { xs: 1, sm: 2 },
        }, children: [_jsxs(Box, { sx: {
                    width: { xs: '100%', sm: '35vw', md: 'clamp(250px, 25vw, 350px)' },
                    maxWidth: '100%',
                    minWidth: { xs: '100%', sm: '200px', md: '250px' },
                    display: { xs: 'none', md: 'block' },
                    overflowY: 'auto',
                    bgcolor: 'background.paper',
                    p: { xs: 1, sm: 2 },
                    borderRight: { md: '1px solid #ddd' },
                    height: '100%',
                }, children: [_jsx(Typography, { variant: "h6", gutterBottom: true, sx: { fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 500 }, children: "Chat History" }), _jsx(List, { sx: { pr: 1 }, children: sessions.map((session) => {
                            var _a, _b;
                            return (_jsxs(ListItem, { onClick: () => handleSelectSession(session.sessionId), sx: {
                                    bgcolor: session.sessionId === sessionId ? 'grey.200' : 'transparent',
                                    borderRadius: 1,
                                    mb: 1,
                                    py: 1.5,
                                    px: 2,
                                    transition: 'background-color 0.2s',
                                    '&:hover': { bgcolor: 'grey.100' },
                                    cursor: 'pointer',
                                }, children: [_jsx(ListItemText, { primary: (_a = session.title) !== null && _a !== void 0 ? _a : `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`, secondary: moment(session.createdAt).fromNow(), primaryTypographyProps: {
                                            fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                            noWrap: true,
                                        }, secondaryTypographyProps: {
                                            fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                                            noWrap: true,
                                        } }), _jsx(IconButton, { edge: "end", onClick: (e) => { e.stopPropagation(); handleDeleteSession(session.sessionId); }, "aria-label": `Delete session ${(_b = session.title) !== null && _b !== void 0 ? _b : session.sessionId}`, sx: { p: 0.5 }, children: _jsx(DeleteIcon, { fontSize: "small" }) })] }, session.sessionId));
                        }) })] }), _jsxs(Box, { sx: {
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    minWidth: 0,
                    overflow: 'hidden',
                }, children: [_jsxs(Box, { sx: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                            gap: 1,
                            p: { xs: 1, sm: 2 },
                            bgcolor: 'background.paper',
                            borderBottom: '1px solid #ddd',
                        }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(HistoryIcon, {}), onClick: () => setDrawerOpen(true), sx: { display: { md: 'none' }, flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "View chat history", children: "History" }), _jsxs(Box, { sx: { display: 'flex', gap: 1, flexWrap: 'wrap' }, children: [_jsx(Button, { variant: "outlined", startIcon: _jsx(AddIcon, {}), onClick: handleNewChat, disabled: loading, sx: { flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "Start new chat", children: "New Chat" }), _jsx(Button, { variant: "outlined", color: "error", onClick: () => setConfirmClear(true), disabled: loading, sx: { flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, "aria-label": "Delete chats", children: "Clear" })] })] }), _jsxs(Box, { sx: {
                            display: 'flex',
                            flexDirection: 'column',
                            flexGrow: 1,
                            overflow: 'hidden',
                            p: { xs: 1, sm: 2 },
                        }, children: [_jsx(Typography, { variant: "h4", sx: { fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', mb: 1 }, children: "Chat with MindEase" }), _jsxs(Typography, { variant: "body1", sx: { fontSize: 'clamp(0.875rem, 2vw, 1rem)', mb: 2 }, children: ["Welcome, ", (_a = user === null || user === void 0 ? void 0 : user.name) !== null && _a !== void 0 ? _a : 'User', "! How can I assist you today?"] }), _jsx(Box, { sx: {
                                    flexGrow: 1,
                                    overflowY: 'auto',
                                    mb: 2,
                                    p: { xs: 1, sm: 2 },
                                    border: '1px solid #ddd',
                                    borderRadius: 1,
                                    bgcolor: 'background.default',
                                }, children: _jsx(List, { sx: { p: 0 }, children: messages.map((msg) => {
                                        var _a;
                                        return (_jsx(ListItem, { sx: {
                                                flexDirection: 'column',
                                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                                py: 1,
                                            }, children: _jsx(ListItemText, { primary: msg.content, secondary: msg.role === 'user' ? 'You' : 'Assistant', sx: {
                                                    bgcolor: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                                                    p: 1.5,
                                                    borderRadius: 2,
                                                    maxWidth: '80%',
                                                    wordBreak: 'break-word',
                                                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                } }) }, (_a = msg._id) !== null && _a !== void 0 ? _a : `${msg.role}-${msg.content}-${Math.random()}`));
                                    }) }) }), _jsxs(Box, { sx: {
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    p: { xs: 1, sm: 0 },
                                }, children: [_jsx(TextField, { fullWidth: true, value: input, onChange: (e) => setInput(e.target.value), placeholder: "Type your message...", onKeyDown: (e) => e.key === 'Enter' && handleSend(), disabled: loading, "aria-label": "Chat input", sx: {
                                            flexGrow: 1,
                                            '& .MuiInputBase-root': { fontSize: 'clamp(0.875rem, 2vw, 1rem)' },
                                        } }), _jsx(Button, { variant: "contained", onClick: handleSend, disabled: loading || !input.trim(), "aria-label": "Send message", sx: {
                                            flexShrink: 0,
                                            height: 'fit-content',
                                            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                                            px: 3,
                                        }, children: loading ? 'Sending...' : 'Send' })] })] })] }), _jsxs(Dialog, { open: confirmClear, onClose: () => setConfirmClear(false), children: [_jsx(DialogTitle, { sx: { fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }, children: "Confirm Clear Chat" }), _jsx(DialogContent, { children: _jsx(Typography, { sx: { fontSize: 'clamp(0.875rem, 2vw, 1rem)' }, children: "Are you sure you want to clear this chat? This action cannot be undone." }) }), _jsxs(DialogActions, { children: [_jsx(Button, { onClick: () => setConfirmClear(false), sx: { fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, children: "Cancel" }), _jsx(Button, { onClick: handleDeleteChats, color: "error", sx: { fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }, children: "Clear" })] })] }), _jsx(Drawer, { anchor: "left", open: drawerOpen, onClose: () => setDrawerOpen(false), sx: {
                    '& .MuiDrawer-paper': {
                        width: { xs: '80vw', sm: 'clamp(350px, 40vw, 400px)' },
                        maxWidth: '100%',
                        bgcolor: 'background.paper',
                    },
                }, children: _jsxs(Box, { sx: {
                        p: { xs: 2, sm: 3 },
                        overflowY: 'auto',
                        height: '100%',
                    }, children: [_jsx(Typography, { variant: "h6", sx: { fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: '500rem', mb: 2 }, children: "Chat Sessions" }), _jsx(List, { sx: { pr: 1 }, children: sessions.map((session) => {
                                var _a;
                                return (_jsxs(ListItem, { onClick: () => handleSelectSession(session.sessionId), sx: {
                                        bgcolor: session.sessionId === sessionId ? 'grey' : 'transparent',
                                        borderRadius: 1,
                                        mb: 1,
                                        py: 1.5,
                                        px: 2,
                                        transition: 'background-color 0.2s',
                                        '&:hover': { bgcolor: 'grey' },
                                        cursor: 'pointer',
                                    }, children: [_jsx(ListItemText, { primary: (_a = session.title) !== null && _a !== void 0 ? _a : `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`, secondary: moment(session.createdAt).fromNow(), primaryTypographyProps: {
                                                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                                                noWrap: true,
                                            }, secondaryTypographyProps: {
                                                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                                                noWrap: true,
                                            } }), _jsx(IconButton, { edge: "end", onClick: (e) => { e.stopPropagation(); handleDeleteSession(session.sessionId); }, "aria-label": `Delete session ${session.title || session.sessionId}`, sx: { p: 0.5 }, children: _jsx(DeleteIcon, { fontSize: "small" }) })] }, session.sessionId));
                            }) })] }) })] }));
};
export default Chat;
