import { Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

/**
 * 404 Not Found page.
 */
const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        The page you're looking for doesn't exist.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')} aria-label="Go to home">
        Go to Home
      </Button>
    </Container>
  );
};

export default NotFound;