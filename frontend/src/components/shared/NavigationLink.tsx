import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';

interface NavigationLinkProps {
  to: string;
  text: string;
  onClick?: () => void;
  isActive?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  navLink: {
    display: 'inline-block',
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    textDecoration: 'none',
    color: theme.palette.text.primary,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.text.secondary,
    },
  },
  navLinkActive: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const NavigationLink: React.FC<NavigationLinkProps> = ({ to, text, onClick, isActive = false }) => {
  const classes = useStyles();

  return (
    <Link to={to} className={isActive ? classes.navLinkActive : classes.navLink} onClick={onClick}>
      {text}
    </Link>
  );
};

export default NavigationLink;