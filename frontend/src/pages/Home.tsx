import {
  Typography,
  Button,
  Container,
  styled,
  Grid2,
  Box,
  useTheme,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import heroImage from '../assets/img/hero.jpg';
import styles from './Home.module.scss';
import { Chat as ChatIcon } from '@mui/icons-material';
import React, { useCallback } from 'react';

// Define types
interface AuthContext {
  isLoggedIn: boolean;
}

const StyledFeatureBox = styled(Box)(({ theme }) => ({
  minHeight: '120px',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.grey[300]}`,
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

/**
 * Home page with hero and features sections.
 */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth() as AuthContext;
  const location = useLocation();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleChatNowClick = useCallback(() => {
    try {
      navigate(isLoggedIn ? '/chat' : '/login', { state: { from: location } });
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  }, [isLoggedIn, navigate, location]);

  return (
    <Box>
      <Box className={styles.heroSection}>
        <Box
          className={styles.heroOverlay}
          sx={{
            backgroundColor: isDarkMode
              ? 'rgba(130, 122, 122, 0.7)'
              : 'rgba(127, 120, 120, 0.05)',
          }}
        >
          <Box className={styles.heroContent}>
            <Typography variant="h3" component="h1" gutterBottom aria-label="Welcome to MindEase">
              Welcome to MindEase
            </Typography>
            <Typography variant="h6" gutterBottom>
              Your AI-Powered Mental Wellness Companion
            </Typography>
            <Typography variant="body1" component="p" gutterBottom>
              Talk to our intelligent chatbot for support, self-care tips, and
              resources to help you navigate life&apos;s challenges.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              onClick={handleChatNowClick}
              startIcon={<ChatIcon />}
              aria-label="Chat with MindEase"
            >
              Chat Now
            </Button>
          </Box>
        </Box>
        <img
          src={heroImage}
          alt="Chatbot illustration"
          className={styles.heroImage}
          loading="lazy"
        />
      </Box>

      <Container
        component="main"
        maxWidth="xl"
        sx={{ mt: 8, mb: 8, flexGrow: 1, padding: { xs: 2, sm: 3 } }}
      >
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{ textAlign: 'center' }}
          aria-label="Key Features"
        >
          Key Features
        </Typography>
        <Grid2
          container
          spacing={4}
          sx={{
            mt: 8,
            mb: 8,
            flexGrow: 1,
            px: { xs: 2, md: 4 },
          }}
        >
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant="h5" component="h3" gutterBottom>
                Personalized Support
              </Typography>
              <Typography variant="body2">
                Get tailored advice and resources based on your specific needs.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant="h5" component="h3" gutterBottom>
                24/7 Availability
              </Typography>
              <Typography variant="body2">
                Our chatbot is here for you anytime, day or night.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant="h5" component="h3" gutterBottom>
                Confidential & Secure
              </Typography>
              <Typography variant="body2">
                Your conversations are private and protected.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
        </Grid2>
      </Container>
    </Box>
  );
};

export default React.memo(Home);