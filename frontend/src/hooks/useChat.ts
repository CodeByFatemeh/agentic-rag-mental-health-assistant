import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { sendChatRequest, getUserChats, deleteUserChats, getChatSessions } from '../services/chat';
import { useAuth } from '../hooks/useAuth';
import { ChatMessage, ChatSession } from '../types';
import { MESSAGE_SENT_SUCCESS, CHATS_LOADED_SUCCESS, CHATS_DELETED_SUCCESS } from '../utils/constants';

interface ChatState {
  messages: ChatMessage[];
  input: string;
  sessionId: string;
  loading: boolean;
  sessions: ChatSession[];
  drawerOpen: boolean;
  confirmClear: boolean;
}

interface ChatActions {
  setInput: (value: string) => void;
  handleSend: () => Promise<void>;
  handleNewChat: () => void;
  handleDeleteChats: () => Promise<void>;
  handleSelectSession: (id: string) => Promise<void>;
  handleDeleteSession: (id: string) => Promise<void>;
  toggleDrawer: () => void;
  setConfirmClear: (open: boolean) => void;
}

export const useChat = (): [ChatState, ChatActions] => {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [state, setState] = useState<ChatState>({
    messages: [],
    input: '',
    sessionId: (() => {
      const saved = localStorage.getItem('chatSessionId');
      if (saved) return saved;
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

  const fetchSessions = async () => {
    if (!user) return
  
    const response = await getChatSessions()
  
    setState(prev => ({
      ...prev,
      sessions: response.data ?? []
    }))
  }

  const fetchChats = async (id: string) => {
    if (!user) return;
    try {
      const response = await getUserChats(id);
      if (response.data) {
        setState((prev) => ({ ...prev, messages: response.data ?? [] }));
        toast.success(CHATS_LOADED_SUCCESS);
      }
    } catch (error) {
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
      if (!user) return;
      try {
        const response = await getChatSessions();
        setState((prev) => ({ ...prev, sessions: (response as { data: ChatSession[] }).data }));
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };
    if (!authLoading && user) {
      fetchSessions();
    }
  }, [user, authLoading]);

  const setInput = (value: string) => setState((prev) => ({ ...prev, input: value }));

  const handleSend = async () => {
    if (!state.input.trim()) return;
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const response = await sendChatRequest(state.input, state.sessionId);
      if (response.data) {
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, { role: 'user', content: prev.input }, ...response.data ?? []],
          input: '',
        }));
        toast.success(MESSAGE_SENT_SUCCESS);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
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
      await deleteUserChats(state.sessionId)
      const newId = uuidv4()
      localStorage.setItem('chatSessionId', newId)
      
      setState((prev) => ({
        ...prev,
        messages: [],
        sessionId: newId,
        confirmClear: false
      }))
      toast.success(CHATS_DELETED_SUCCESS);
    } catch (error) {
      console.error('Error deleting chats:', error);
      toast.error('Failed to delete chats');
    }
  };

  const handleSelectSession = async (id: string) => {
    localStorage.setItem('chatSessionId', id);
    setState((prev) => ({ ...prev, sessionId: id, drawerOpen: false }));
  };

  const handleDeleteSession = async (id: string) => {
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
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session');
    }
  };

  const toggleDrawer = () => setState((prev) => ({ ...prev, drawerOpen: !prev.drawerOpen }));

  const setConfirmClear = (open: boolean) => setState((prev) => ({ ...prev, confirmClear: open }));

  return [state, { setInput, handleSend, handleNewChat, handleDeleteChats, handleSelectSession, handleDeleteSession, toggleDrawer, setConfirmClear }];
};
