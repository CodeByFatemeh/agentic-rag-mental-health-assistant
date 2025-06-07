import { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Drawer,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { toast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import {
  sendChatRequest,
  getUserChats,
  deleteUserChats,
  getChatSessions
} from '../services/chat'
import { useAuth } from '../hooks/useAuth'
import { ChatMessage, ChatSession } from '../types'
import {
  MESSAGE_SENT_SUCCESS,
  CHATS_LOADED_SUCCESS,
  CHATS_DELETED_SUCCESS
} from '../utils/constants'
import HistoryIcon from '@mui/icons-material/History'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import moment from 'moment'
import { alpha, useTheme } from '@mui/material/styles'
import { colorTokens } from '../styles/theme'

const Chat: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sessionId, setSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('chatSessionId')
    if (saved) return saved
    const newId = uuidv4()
    localStorage.setItem('chatSessionId', newId)
    return newId
  })
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  

  const fetchChats = async (id: string) => {
    if (!user) return
    try {
      const response = await getUserChats(id)
      if (response.data) {
        setMessages(response.data)
        toast.success(CHATS_LOADED_SUCCESS)
      }
    } catch (error) {
      console.error('Error loading chats:', error)
      toast.error('Failed to load chats')
    }
  }

  useEffect(() => {
    fetchChats(sessionId)
  }, [sessionId, user])

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return
      try {
        const response = await getChatSessions()
        setSessions((response as { data: ChatSession[] }).data)
      } catch (error) {
        console.error('Error loading sessions:', error)
      }
    }
    fetchSessions()
  }, [user])

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)
    try {
      const response = await sendChatRequest(input, sessionId)
      if (response.data) {
        setMessages(prev => [
          ...prev,
          { role: 'user', content: input },
          ...(response.data || [])
        ])
        toast.success(MESSAGE_SENT_SUCCESS)
        setInput('')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = () => {
    const newId = uuidv4()
    localStorage.setItem('chatSessionId', newId)
    setSessionId(newId)
    setMessages([])
    toast.success('New chat started')
  }

  const handleDeleteChats = async () => {
    try {
      await deleteUserChats(sessionId)
      setMessages([])
      localStorage.removeItem('chatSessionId')
      setSessionId(uuidv4())
      toast.success(CHATS_DELETED_SUCCESS)
      setConfirmClear(false)
    } catch (error) {
      console.error('Error deleting chats:', error)
      toast.error('Failed to delete chats')
    }
  }

  const handleSelectSession = async (id: string) => {
    localStorage.setItem('chatSessionId', id)
    setSessionId(id)
    await fetchChats(id)
    setDrawerOpen(false)
  }

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteUserChats(id)
      setSessions(prev => prev.filter(s => s.sessionId !== id))
      if (id === sessionId) {
        handleNewChat()
      }
      toast.success('Session deleted')
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Failed to delete session')
    }
  }

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        p: { xs: 1, sm: 2 }
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', sm: '35vw', md: 'clamp(250px, 25vw, 350px)' },
          maxWidth: '100%',
          minWidth: { xs: '100%', sm: '200px', md: '250px' },
          display: { xs: 'none', md: 'block' },
          overflowY: 'auto',
          bgcolor: 'background.default',
          p: { xs: 1, sm: 2 },
          boxShadow: {
            md: `8px 0 8px -4px ${isDark ? alpha(theme.palette.white, 0.3) : alpha(theme.palette.primaryBlack, 0.3)}`,
          },
          margin: '1rem',
          height: '100%'
        }}
      >
        <Typography
          variant='h6'
          gutterBottom
          sx={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontWeight: 500 }}
        >
          Chat History
        </Typography>
        <List sx={{ pr: 1 }}>
          {sessions.map(session => (
            <ListItem
              key={session.sessionId}
              onClick={() => handleSelectSession(session.sessionId)}
              sx={{
                bgcolor:
                  session.sessionId === sessionId ? alpha(colorTokens.calmBlue, 0.7) : 'transparent',
                borderRadius: 1,
                mb: 1,
                py: 1.5,
                px: 2,
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: alpha(colorTokens.calmBlue, 0.4) },
                cursor: 'pointer'
              }}
            >
              <ListItemText
                primary={
                  session.title ??
                  `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`
                }
                secondary={moment(session.createdAt).fromNow()}
                primaryTypographyProps={{
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  noWrap: true
                }}
                secondaryTypographyProps={{
                  fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                  noWrap: true,
                  color: `${isDark ? alpha(theme.palette.white, 0.5) : alpha(theme.palette.primaryBlack, 0.5)}`
                }}
              />
              <IconButton
                edge='end'
                onClick={e => {
                  e.stopPropagation()
                  handleDeleteSession(session.sessionId)
                }}
                aria-label={`Delete session ${
                  session.title ?? session.sessionId
                }`}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon fontSize='small' />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            gap: 1,
            p: { xs: 1, sm: 2 },
            bgcolor: 'background.default',
            boxShadow: {
            md: `0 2px 4px ${isDark ? alpha(theme.palette.white, 0.2) : alpha(theme.palette.primaryBlack, 0.2)}`,
          },
            // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Button
            variant='outlined'
            startIcon={<HistoryIcon />}
            onClick={() => setDrawerOpen(true)}
            sx={{
              display: { md: 'none' },
              flexShrink: 0,
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
            }}
            aria-label='View chat history'
          >
            History
          </Button>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant='outlined'
              startIcon={<AddIcon />}
              onClick={handleNewChat}
              disabled={loading}
              sx={{ flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
              aria-label='Start new chat'
            >
              New Chat
            </Button>
            <Button
              variant='outlined'
              color='error'
              onClick={() => setConfirmClear(true)}
              disabled={loading}
              sx={{ flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
              aria-label='Delete chats'
            >
              Clear
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            overflow: 'hidden',
            p: { xs: 1, sm: 2 }
          }}
        >
          <Typography
            variant='h4'
            sx={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', mb: 1 }}
          >
            Chat with MindEase
          </Typography>
          <Typography
            variant='body1'
            sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', mb: 2 }}
          >
            Welcome, {user?.name ?? 'User'}! How can I assist you today?
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              mb: 2,
              p: { xs: 1, sm: 2 },
              // border: '1px solid #ddd',
              // borderRadius: 1,
              bgcolor: 'background.default'
            }}
          >
            <List sx={{ p: 0 }}>
              {messages.map(msg => (
                <ListItem
                  key={msg._id ?? `${msg.role}-${msg.content}-${Math.random()}`}
                  sx={{
                    flexDirection: 'column',
                    alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    py: 1
                  }}
                >
                  <ListItemText
                    primary={msg.content}
                    secondary={msg.role === 'user' ? 'You' : 'Assistant'}
                    sx={{
                      bgcolor:
                        msg.role === 'user' ? 'userMessage.main' : 'inherit',
                      p: 1.5,
                      borderRadius: 2,
                      maxWidth: '80%',
                      wordBreak: 'break-word',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              p: { xs: 1, sm: 0 }
            }}
          >
            <TextField
              fullWidth
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder='Type your message...'
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
              aria-label='Chat input'
              sx={{
                flexGrow: 1,
                '& .MuiInputBase-root': {
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                }
              }}
            />
            <Button
              variant='contained'
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label='Send message'
              sx={{
                flexShrink: 0,
                height: 'fit-content',
                fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                px: 3
              }}
            >
              {loading ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Box>
      </Box>
      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle sx={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
          Confirm Clear Chat
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            Are you sure you want to clear this chat? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmClear(false)}
            sx={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteChats}
            color='error'
            sx={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          >
            Clear
          </Button>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '80vw', sm: 'clamp(350px, 40vw, 400px)' },
            maxWidth: '100%',
            bgcolor: 'background.default'
          }
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            overflowY: 'auto',
            height: '100%'
          }}
        >
          <Typography
            variant='h6'
            sx={{
              fontSize: 'clamp(1rem, 2vw, 1.5rem)',
              fontWeight: '500rem',
              mb: 2
            }}
          >
            Chat Sessions
          </Typography>
          <List sx={{ pr: 1 }}>
            {sessions.map(session => (
              <ListItem
                key={session.sessionId}
                onClick={() => handleSelectSession(session.sessionId)}
                sx={{
                  bgcolor:
                    session.sessionId === sessionId ? alpha(colorTokens.calmBlue, 0.7) : 'transparent',
                  borderRadius: 1,
                  mb: 1,
                  py: 1.5,
                  px: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: alpha(colorTokens.calmBlue, 0.4) },
                  cursor: 'pointer'
                }}
              >
                <ListItemText
                  primary={
                    session.title ??
                    `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`
                  }
                  secondary={moment(session.createdAt).fromNow()}
                  primaryTypographyProps={{
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    noWrap: true
                  }}
                  secondaryTypographyProps={{
                    fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                    noWrap: true
                  }}
                />
                <IconButton
                  edge='end'
                  onClick={e => {
                    e.stopPropagation()
                    handleDeleteSession(session.sessionId)
                  }}
                  aria-label={`Delete session ${
                    session.title ?? session.sessionId
                  }`}
                  sx={{ p: 0.5 }}
                >
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Container>
  )
}

export default Chat
