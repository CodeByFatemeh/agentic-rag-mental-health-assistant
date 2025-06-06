import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ClearChatDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ClearChatDialog: React.FC<ClearChatDialogProps> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle sx={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}>
      Confirm Clear Chat
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
        Are you sure you want to clear this chat? This action cannot be undone.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button
        onClick={onClose}
        sx={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
      >
        Cancel
      </Button>
      <Button
        onClick={onConfirm}
        color="error"
        sx={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
      >
        Clear
      </Button>
    </DialogActions>
  </Dialog>
);
