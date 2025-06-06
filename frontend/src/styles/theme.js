import { createTheme, alpha } from '@mui/material/styles';
import { red } from '@mui/material/colors';
// Color tokens
const colorTokens = {
    white: '#FFFFFF',
    black: '#000000',
    darkText: alpha('#000000', 0.9),
    lightGreen: '#91a95e',
    darkGreen: '#5c7529',
    lightGray: '#e0dfdf',
    darkGray: '#a9a9a9',
    lightBackground: '#f9f9f7',
    darkBackground: '#20272f',
    darkPaper: '#1a2b6d',
    lightChatInput: '#f0f4f9',
    darkChatInput: '#282828',
    primaryLight: '#4A90E2',
    primaryLightHover: '#357BCD',
    primaryDark: '#90CAF9',
    primaryDarkHover: '#64B5F6',
    secondaryLight: '#9E9E9E',
    secondaryDark: '#BDBDBD',
    errorLight: red[300],
    errorDark: red.A400,
    errorDarkMode: '#EF9A9A',
    errorDarkModeHover: '#E57373'
};
export const getDesignTokens = (mode) => {
    const isLight = mode === 'light';
    return {
        palette: {
            mode,
            primary: {
                main: isLight ? colorTokens.primaryLight : colorTokens.primaryDark,
                dark: isLight ? colorTokens.primaryLightHover : colorTokens.primaryDarkHover
            },
            secondary: {
                main: isLight ? colorTokens.secondaryLight : colorTokens.secondaryDark
            },
            error: {
                main: isLight ? colorTokens.errorLight : colorTokens.errorDarkMode,
                dark: isLight ? colorTokens.errorDark : colorTokens.errorDarkModeHover
            },
            text: {
                primary: isLight ? colorTokens.darkText : colorTokens.white,
                secondary: isLight ? '#616161' : colorTokens.secondaryDark
            },
            chatInput: {
                main: isLight ? colorTokens.lightChatInput : colorTokens.darkChatInput
            },
            background: {
                default: isLight ? colorTokens.lightBackground : colorTokens.darkBackground,
                paper: isLight ? colorTokens.lightBackground : colorTokens.darkPaper
            },
            white: colorTokens.white,
            darkText: colorTokens.darkText,
            lightGray: colorTokens.lightGray,
            darkGray: colorTokens.darkGray,
            lightGreen: colorTokens.lightGreen,
            darkGreen: colorTokens.darkGreen
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        color: isLight ? colorTokens.black : colorTokens.white
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: 8,
                        padding: '10px 20px',
                        textTransform: 'none',
                        fontWeight: 600
                    },
                    containedPrimary: {
                        color: isLight ? colorTokens.white : colorTokens.black,
                        '&:hover': {
                            backgroundColor: isLight
                                ? colorTokens.primaryLightHover
                                : colorTokens.primaryDarkHover
                        }
                    },
                    containedSecondary: {
                        color: isLight ? colorTokens.black : colorTokens.white
                    },
                    containedError: {
                        color: isLight ? colorTokens.white : colorTokens.black
                    }
                },
                // To satisfy TypeScript
                variants: []
            }
        }
    };
};
const theme = (mode) => createTheme(getDesignTokens(mode));
export default theme;
