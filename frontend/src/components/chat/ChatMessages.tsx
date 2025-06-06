import { Box } from '@mui/material';
import { ChatItem } from './ChatItem';
import { ChatMessage } from '../../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => (
  <Box
    sx={{
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
    }}
  >
    {messages.map((msg) => (
      <ChatItem key={msg._id ?? `${msg.role}-${msg.content}-${Math.random()}`} message={msg} />
    ))}
  </Box>
);
