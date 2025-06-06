import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { sendChatRequest, getUserChats, deleteUserChats, getChatSessions } from '../services/chat';
import { useAuth } from '../hooks/useAuth';
import { MESSAGE_SENT_SUCCESS, CHATS_LOADED_SUCCESS, CHATS_DELETED_SUCCESS } from '../utils/constants';
export const useChat = () => {
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const [state, setState] = useState({
        messages: [],
        input: '',
        sessionId: (() => {
            const saved = localStorage.getItem('chatSessionId');
            if (saved)
                return saved;
            const newId = uuidv4();
            localStorage.setItem('chatSessionId', newId);
            return newId;
        })(),
        loading: false,
        sessions: [],
        drawerOpen: false,
        confirmClear: false,
    });
    // Remove redirect logic, rely on AuthProvider
    useEffect(() => {
        if (!authLoading && !isLoggedIn && user === null) {
            // AuthProvider handles navigation
            return;
        }
    }, [authLoading, isLoggedIn, user]);
    const fetchChats = async (id) => {
        if (!user)
            return;
        try {
            const response = await getUserChats(id);
            if (response.data) {
                setState((prev) => { var _a; return ({ ...prev, messages: (_a = response.data) !== null && _a !== void 0 ? _a : [] }); });
                toast.success(CHATS_LOADED_SUCCESS);
            }
        }
        catch (error) {
            console.error('Error loading chats:', error);
            toast.error('Failed to load chats');
        }
    };
    useEffect(() => {
        if (!authLoading && user) {
            fetchChats(state.sessionId);
        }
    }, [state.sessionId, user, authLoading]);
    useEffect(() => {
        const fetchSessions = async () => {
            if (!user)
                return;
            try {
                const response = await getChatSessions();
                setState((prev) => ({ ...prev, sessions: response.data }));
            }
            catch (error) {
                console.error('Error loading sessions:', error);
            }
        };
        if (!authLoading && user) {
            fetchSessions();
        }
    }, [user, authLoading]);
    const setInput = (value) => setState((prev) => ({ ...prev, input: value }));
    const handleSend = async () => {
        if (!state.input.trim())
            return;
        setState((prev) => ({ ...prev, loading: true }));
        try {
            const response = await sendChatRequest(state.input, state.sessionId);
            if (response.data) {
                setState((prev) => {
                    var _a;
                    return ({
                        ...prev,
                        messages: [...prev.messages, { role: 'user', content: prev.input }, ...(_a = response.data) !== null && _a !== void 0 ? _a : []],
                        input: '',
                    });
                });
                toast.success(MESSAGE_SENT_SUCCESS);
            }
        }
        catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
        finally {
            setState((prev) => ({ ...prev, loading: false }));
        }
    };
    const handleNewChat = () => {
        const newId = uuidv4();
        localStorage.setItem('chatSessionId', newId);
        setState((prev) => ({ ...prev, sessionId: newId, messages: [] }));
        toast.success('New chat started');
    };
    const handleDeleteChats = async () => {
        try {
            await deleteUserChats(state.sessionId);
            localStorage.removeItem('chatSessionId');
            const newId = uuidv4();
            setState((prev) => ({ ...prev, messages: [], sessionId: newId, confirmClear: false }));
            toast.success(CHATS_DELETED_SUCCESS);
        }
        catch (error) {
            console.error('Error deleting chats:', error);
            toast.error('Failed to delete chats');
        }
    };
    const handleSelectSession = async (id) => {
        localStorage.setItem('chatSessionId', id);
        setState((prev) => ({ ...prev, sessionId: id, drawerOpen: false }));
        await fetchChats(id);
    };
    const handleDeleteSession = async (id) => {
        try {
            await deleteUserChats(id);
            setState((prev) => ({
                ...prev,
                sessions: prev.sessions.filter((s) => s.sessionId !== id),
            }));
            if (id === state.sessionId) {
                handleNewChat();
            }
            toast.success('Session deleted');
        }
        catch (error) {
            console.error('Error deleting session:', error);
            toast.error('Failed to delete session');
        }
    };
    const toggleDrawer = () => setState((prev) => ({ ...prev, drawerOpen: !prev.drawerOpen }));
    const setConfirmClear = (open) => setState((prev) => ({ ...prev, confirmClear: open }));
    return [state, { setInput, handleSend, handleNewChat, handleDeleteChats, handleSelectSession, handleDeleteSession, toggleDrawer, setConfirmClear }];
};
