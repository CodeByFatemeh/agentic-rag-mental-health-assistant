import {
  Typography,
  Button,
  Container,
  styled,
  useTheme,
  Grid2
} from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import HeroImage from '../assets/img/hero.jpg'
import styles from './Home.module.scss'

const StyledFeatureBox = styled('div')(({ theme }) => ({
  minHeight: '120px',
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  margin: theme.spacing(1)
}))

const Home = () => {
  const navigate = useNavigate()
  const auth = useAuth()
  const location = useLocation()
  const theme = useTheme()

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
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <Typography
              variant='h3'
              component='h1'
              sx={{ color: theme.palette.text.primary }}
            >
              Welcome to MindEase
            </Typography>
            <Typography
              variant='h6'
              sx={{ color: theme.palette.text.secondary }}
            >
              Your AI-Powered Mental Wellness Companion
            </Typography>
            <Typography
              variant='body1'
              sx={{ color: theme.palette.text.secondary }}
            >
              Talk to our intelligent chatbot for support, self-care tips, and
              resources to help you navigate life's challenges.
            </Typography>
            <Button
              variant='contained'
              color='primary'
              size='large'
              sx={{ mt: 2 }}
              onClick={handleChatNowClick}
            >
              Chat Now
            </Button>
          </div>
        </div>
        <img
          src={HeroImage}
          alt='Chatbot illustration'
          className={styles.heroImage}
        />
      </div>

      <Container
        component='main'
        maxWidth='xl'
        sx={{ mt: 8, mb: 8, flexGrow: 1 }}
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
          sx={{ mt: 8, mb: 8, flexGrow: 1, px: { xs: 2, md: 4 } }}
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
