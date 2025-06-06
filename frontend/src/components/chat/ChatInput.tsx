import { Box, TextField, Button } from '@mui/material';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => Promise<void>;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, disabled }) => (
  <Box
    sx={{
      display: 'flex',
      gap: 1,
      alignItems: 'center',
      flexWrap: 'wrap',
      p: { xs: 1, sm: 0 },
    }}
  >
    <TextField
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your message..."
      onKeyDown={(e) => e.key === 'Enter' && onSend()}
      disabled={disabled}
      aria-label="Chat input"
      sx={{
        flexGrow: 1,
        '& .MuiInputBase-root': { fontSize: 'clamp(0.875rem, 2vw, 1rem)' },
      }}
    />
    <Button
      variant="contained"
      onClick={onSend}
      disabled={disabled}
      aria-label="Send message"
      sx={{
        flexShrink: 0,
        height: 'fit-content',
        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
        px: 3,
      }}
    >
      {disabled ? 'Sending...' : 'Send'}
    </Button>
  </Box>
);
