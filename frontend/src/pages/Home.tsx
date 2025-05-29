import {
  Typography,
  Button,
  Container,
  styled,
  Grid2,
  Box,
  useTheme
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import heroImage from '../assets/img/hero.jpg'
import styles from './Home.module.scss'
import ChatIcon from '@mui/icons-material/Chat'

const StyledFeatureBox = styled(Box)(({ theme }) => ({
  minHeight: '120px',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.lightGray}`,
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)'
  }
}))

const Home = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const location = useLocation()
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const handleChatNowClick = () => {
    if (auth.isLoggedIn) {
      navigate('/chat')
    } else {
      navigate('/login', { state: { from: location } })
    }
  }

  return (
    <div>
      <div className={styles.heroSection}>
        <div
          className={styles.heroOverlay}
          style={{
            backgroundColor: isDarkMode
              ? 'rgba(130, 122, 122, 0.7)'
              : 'rgba(127, 120, 120, 0.05)'
          }}
        >
          <div className={styles.heroContent}>
            <Typography variant='h3' component='h1' gutterBottom>
              Welcome to MindEase
            </Typography>
            <Typography variant='h6' gutterBottom>
              Your AI-Powered Mental Wellness Companion
            </Typography>
            <Typography variant='body1' component={'p'} gutterBottom>
              Talk to our intelligent chatbot for support, self-care tips, and
              resources to help you navigate life's challenges.
            </Typography>
            <Button
              variant='contained'
              color='primary'
              size='large'
              sx={{ mt: 2 }}
              onClick={handleChatNowClick}
              startIcon={<ChatIcon />}
              aria-label='Chat with MindEase'
            >
              Chat Now
            </Button>
          </div>
        </div>
        <img
          src={heroImage}
          alt='Chatbot illustration'
          className={styles.heroImage}
        />
      </div>

      <Container
        component='main'
        maxWidth='xl'
        sx={{ mt: 8, mb: 8, flexGrow: 1, padding: { xs: 2, sm: 3 } }}
      >
        <Typography
          variant='h4'
          component='h2'
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Key Features
        </Typography>
        <Grid2
          container
          spacing={4}
          justifyContent='center'
          sx={{
            mt: 8,
            mb: 8,
            flexGrow: 1,
            px: { xs: 2, md: 4 },
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }
          }}
        >
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant='h5' component='h3' gutterBottom>
                Personalized Support
              </Typography>
              <Typography variant='body2'>
                Get tailored advice and resources based on your specific needs.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant='h5' component='h3' gutterBottom>
                24/7 Availability
              </Typography>
              <Typography variant='body2'>
                Our chatbot is here for you anytime, day or night.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <StyledFeatureBox>
              <Typography variant='h5' component='h3' gutterBottom>
                Confidential & Secure
              </Typography>
              <Typography variant='body2'>
                Your conversations are private and protected.
              </Typography>
            </StyledFeatureBox>
          </Grid2>
        </Grid2>
      </Container>
    </div>
  )
}

export default Home
