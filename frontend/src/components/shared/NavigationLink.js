import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme) => ({
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
const NavigationLink = ({ to, text, onClick, isActive = false }) => {
    const classes = useStyles();
    return (_jsx(Link, { to: to, className: isActive ? classes.navLinkActive : classes.navLink, onClick: onClick, children: text }));
};
export default NavigationLink;
