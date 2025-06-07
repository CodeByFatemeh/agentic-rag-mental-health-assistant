import { Box, Drawer, List, ListItem, ListItemText, Typography, IconButton } from '@mui/material';
import moment from 'moment';
import { ChatSession } from '../../types';
import DeleteIcon from '@mui/icons-material/Delete';

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => Promise<void>;
  onDeleteSession: (id: string) => Promise<void>;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  isDrawerOpen,
  onToggleDrawer,
}) => {
  const renderHistoryList = (isDrawer: boolean = false) => (
    <Box
      sx={{
        p: { xs: isDrawer ? 2 : 1, sm: isDrawer ? 3 : 2 },
        overflowY: 'auto',
        height: '100%',
        bgcolor: 'background.default',
        ...(isDrawer ? {} : {
          width: { xs: '100%', sm: '35vw', md: 'clamp(250px, 25vw, 350px)' },
          maxWidth: '100%',
          minWidth: { xs: '100%', sm: '200px', md: '250px' },
          display: { xs: 'none', md: 'block' },
          borderRight: { md: '1px solid #ddd' },
        }),
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', fontWeight: 500, mb: 2 }}
      >
        Chat Sessions
      </Typography>
      <List sx={{ pr: 1 }}>
        {sessions.map((session) => (
          <ListItem
            key={session.sessionId}
            onClick={() => onSelectSession(session.sessionId)}
            sx={{
              bgcolor: session.sessionId === currentSessionId ? 'grey.200' : 'transparent',
              borderRadius: 1,
              mb: 1,
              py: 1.5,
              px: 2,
              transition: 'background-color 0.2s',
              '&:hover': { bgcolor: 'grey.100' },
              cursor: 'pointer',
            }}
          >
            <ListItemText
              primary={session.title ?? `Chat ${moment(session.createdAt).format('MMM D, YYYY')}`}
              secondary={moment(session.createdAt).fromNow()}
              primaryTypographyProps={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                noWrap: true,
              }}
              secondaryTypographyProps={{
                fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)',
                noWrap: true,
              }}
            />
            <IconButton
              edge="end"
              onClick={(e) => { e.stopPropagation(); onDeleteSession(session.sessionId); }}
              aria-label={`Delete session ${session.title ?? session.sessionId}`}
              sx={{ p: 0.5 }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {renderHistoryList()}
      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={onToggleDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '80vw', sm: 'clamp(350px, 40vw, 400px)' },
            maxWidth: '100%',
            bgcolor: 'background.default',
          },
        }}
      >
        {renderHistoryList(true)}
      </Drawer>
    </>
  );
};
