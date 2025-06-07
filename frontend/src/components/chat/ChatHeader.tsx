import { Box, Button, Typography } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';

interface ChatHeaderProps {
  onNewChat: () => void;
  onClearChat: () => void;
  onToggleDrawer: () => void;
  loading: boolean;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ onNewChat, onClearChat, onToggleDrawer, loading }) => {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: { xs: 1, sm: 3 },
        bgcolor: 'background.default',
        borderBottom: '1px solid #ddd',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: 1,
          mb: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={onToggleDrawer}
          sx={{ display: { md: 'none' }, flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
          aria-label="View chat history"
        >
          History
        </Button>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onNewChat}
            disabled={loading}
            sx={{ flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            aria-label="Start new chat"
          >
            New Chat
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClearChat}
            disabled={loading}
            sx={{ flexShrink: 0, fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
            aria-label="Delete chats"
          >
            Clear
          </Button>
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', mb: 1 }}
      >
        Chat with MindEase
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)', mb: 2 }}
      >
        Welcome, {user?.name ?? 'User'}! How can I assist you today?
      </Typography>
    </Box>
  );
};
