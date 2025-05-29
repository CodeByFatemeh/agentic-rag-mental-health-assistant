import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  Box,
  Avatar,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  TextField,
  useTheme,
  InputAdornment
} from '@mui/material'
import { v4 as uuidv4 } from 'uuid'
import { useAuth } from '../context/AuthContext'
import ChatItem from '../components/chat/ChatItem'
import { IoMdSend } from 'react-icons/io'
import { useNavigate } from 'react-router-dom'
import ChatService from '../services/chatService'
import { TypingIndicator } from '../components/chat/TypingIndicator'
import toast from 'react-hot-toast'
import {
  OK_MESSAGE,
  MESSAGE_SENT_FAILED,
  DELETING_CHATS_MESSAGE,
  CHATS_DELETED_SUCCESS,
  CHATS_DELETED_FAILED,
  LOADING_CHATS_MESSAGE,
  CHATS_LOADED_SUCCESS,
  CHATS_LOADED_FAILED
} from '../constants'
import { Message, ChatMessage, ApiResponse } from '../types'

const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

const Chat = () => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  const theme = useTheme()

  const auth = useAuth()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize sessionId from localStorage or create new
  const [sessionId, setSessionId] = useState<string>(() => {
    const stored = localStorage.getItem('chatSession')
    if (stored) {
      const { id, timestamp } = JSON.parse(stored)
      if (Date.now() - timestamp < SESSION_EXPIRY_MS) {
        return id
      }
    }
    const newId = uuidv4()
    localStorage.setItem(
      'chatSession',
      JSON.stringify({ id: newId, timestamp: Date.now() })
    )
    return newId
  })

  const isChatSuccessResponse = (
    response: ApiResponse<Message[]>
  ): response is { message: string; data: Message[] } => {
    return response.message === OK_MESSAGE && Array.isArray(response?.data)
  }

  const handleSubmit = async () => {
    try {
      const content = inputRef.current?.value as string
      if (!content.trim()) {
        toast.error('Message cannot be empty')
        return
      }
      if (inputRef?.current) {
        inputRef.current.value = ''
      }
      const newMessage: Message = { role: 'user', content }
      setChatMessages(prev => [...prev, newMessage])
      setIsTyping(true)
      const chatData: ApiResponse<Message[]> =
        await ChatService.sendChatRequest(content, sessionId)

      if (isChatSuccessResponse(chatData)) {
        setChatMessages(prev => [
          ...prev,
          ...chatData.data.map(message => ({ ...message }))
        ])
      } else {
        toast.error(chatData.message || MESSAGE_SENT_FAILED)
      }
    } catch (err: unknown) {
      let errorMessage = MESSAGE_SENT_FAILED
      console.error('Error sending chat:', err)
      if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage, { id: 'sendchats' })
    } finally {
      setIsTyping(false)
    }
  }

  const handleDeleteChats = async () => {
    try {
      toast.loading(DELETING_CHATS_MESSAGE, { id: 'deletechats' })
      await ChatService.deleteUserChats(sessionId)
      setChatMessages([])
      const newId = uuidv4()
      setSessionId(newId)
      localStorage.setItem(
        'chatSession',
        JSON.stringify({ id: newId, timestamp: Date.now() })
      )

      toast.success(CHATS_DELETED_SUCCESS, { id: 'deletechats' })
    } catch (err) {
      let errorMessage = CHATS_DELETED_FAILED
      console.error('Error deleting chat:', err)
      if (err instanceof Error) {
        errorMessage = err.message
      }
      toast.error(errorMessage, { id: 'deletechats' })
    }
  }

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading(LOADING_CHATS_MESSAGE, { id: 'loadchats' })
      ChatService.getUserChats(sessionId)
        .then(data => {
          if (isChatSuccessResponse(data)) {
            setChatMessages(data.data)
            toast.success(CHATS_LOADED_SUCCESS, { id: 'loadchats' })
          } else {
            toast.error('data.message || CHATS_LOADED_FAILED')
          }
        })
        .catch(err => {
          let errorMessage = CHATS_LOADED_FAILED
          console.error('Error loading chat:', err)
          if (err instanceof Error) {
            errorMessage = err.message
          }
          toast.error(errorMessage, { id: 'loadchats' })
        })
        .finally(() => setIsLoading(false))
    }
  }, [auth, sessionId])

  // Reset sessionId on logout
  useEffect(() => {
    if (!auth?.user) {
      localStorage.removeItem('chatSession');
      setSessionId(uuidv4());
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%',
        mt: 3,
        gap: 3
      }}
    >
      <Box
        sx={{
          display: { md: 'flex', xs: 'none', sm: 'none' },
          flex: 0.2,
          flexDirection: 'column',
          backgroundColor: theme.palette.chatInput.main,
          borderRadius: 5,
          padding: 3,
          marginBottom: 3,
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <Avatar
          sx={{
            mx: 'auto',
            my: 2
          }}
        >
          {auth?.user?.name[0]}
          {auth?.user?.name.split(' ')[1]
            ? auth?.user?.name.split(' ')[1][0]
            : ''}
        </Avatar>
        <Typography color='white.main'>You are talking to a ChatBOT</Typography>
        <Typography color='white.main' sx={{ my: 4 }}>
          You can ask some questions related to Knowledge, Business, Advices,
          Education, etc. But avoid sharing personal information
        </Typography>
        <Button
          onClick={handleDeleteChats}
          variant='contained'
          sx={{
            width: '200px',
            my: 'auto',
            fontWeight: '600',
            mx: 'auto',
            backgroundColor: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.dark
            }
          }}
        >
          Clear Conversation
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: 'column',
          px: 3
        }}
      >
        <Typography variant='h4' sx={{ mb: 2, mx: 'auto' }}>
          Model - GPT 4 with RAG
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: '60vh',
            borderRadius: 3,
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            scrollBehavior: 'smooth'
          }}
          ref={chatContainerRef}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%'
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            chatMessages.map(chat => (
              <ChatItem
                content={chat.content}
                role={chat.role}
                key={chat._id}
                id={chat._id ?? ''}
              />
            ))
          )}
          {isTyping && <TypingIndicator isTyping={isTyping} />}
        </Box>
        <TextField
          inputRef={inputRef}
          fullWidth
          placeholder='Type your message...'
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSubmit()
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  onClick={handleSubmit}
                  sx={{
                    color: 'white.main',
                    mx: 1,
                    '&:hover': { backgroundColor: theme.palette.primary.dark }
                  }}
                >
                  <IoMdSend style={{ color: 'white.main' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  )
}

export default Chat
