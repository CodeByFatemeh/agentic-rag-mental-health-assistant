import { Container, Box } from '@mui/material';
import { useChat } from '../../hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { ChatHistory } from './ChatHistory';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ClearChatDialog } from './ClearChatDialog';

const ChatContainer: React.FC = () => {
  const [{ drawerOpen, confirmClear, sessions, sessionId, messages, input, loading }, actions] = useChat();

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        overflow: 'hidden',
        p: { xs: 1, sm: 2 },
      }}
    >
      <ChatHistory
        sessions={sessions}
        currentSessionId={sessionId}
        onSelectSession={actions.handleSelectSession}
        onDeleteSession={actions.handleDeleteSession}
        isDrawerOpen={drawerOpen}
        onToggleDrawer={actions.toggleDrawer}
      />
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <ChatHeader
          onNewChat={actions.handleNewChat}
          onClearChat={() => actions.setConfirmClear(true)}
          onToggleDrawer={actions.toggleDrawer}
          loading={loading}
        />
        <ChatMessages messages={messages} />
        <ChatInput
          value={input}
          onChange={actions.setInput}
          onSend={actions.handleSend}
          disabled={loading || !input.trim()}
        />
        <ClearChatDialog
          open={confirmClear}
          onClose={() => actions.setConfirmClear(false)}
          onConfirm={actions.handleDeleteChats}
        />
      </Box>
    </Container>
  );
};

export default ChatContainer;
