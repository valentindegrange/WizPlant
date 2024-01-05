// theme.ts
import { createTheme } from '@mui/material/styles';

const colors = {
  light: {
    primary: '#4caf50',
    secondary: {
      main: '#ff9800',
      contrastText:'#303030',
    },
    background: {
        default: '#f5f5f5',
        paper: '#ffffff',
        },
    text: {
        primary: '#000000',
        secondary: '#000000',
        },
  },
  dark : {
    primary: '#81c784',
    secondary: {
      main: '#ffb74d',
      contrastText:'#ffffff',
    },
    background: {
        default: '#121212',
        paper: '#333333',
        },
    text: {
        primary: '#ffffff',
        secondary: '#eeeeee',
        },
  }
}

const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode: mode,
    primary: {
      main: mode === 'dark' ? colors.dark.primary : colors.light.primary, // A green that stands out on dark backgrounds
      contrastText: '#ffffff',
    },
    secondary: {
      main: mode === 'dark' ? colors.dark.secondary.main : colors.light.secondary.main, // A secondary color that contrasts well in dark mode
      contrastText: mode === 'dark' ? colors.dark.secondary.contrastText : colors.light.secondary.contrastText,
    },
    background: {
      default: mode === 'dark' ? colors.dark.background.default : colors.light.background.default, // Darker background for dark mode
      paper: mode === 'dark' ? colors.dark.background.paper : colors.light.background.paper, // A darker shade for containers like cards
    },
    text: {
      primary: mode === 'dark' ? colors.dark.text.primary : colors.light.text.primary, // White text for dark mode, black for light
      secondary: mode === 'dark' ? colors.dark.text.primary : colors.light.text.secondary, // A lighter white for secondary text in dark mode
    },
  },
  typography: {
    fontFamily: [
      'Roboto', '"Open Sans"', 'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? colors.dark.background.paper : colors.light.background.paper, // Dark grey for cards in dark mode
          '&.needsCare': {
            // Define the 'needs care' card background color based on the theme mode
            backgroundColor: mode === 'dark' ? colors.dark.secondary.main : colors.light.secondary.main, // Darker gray for dark mode, light yellow for light mode
          },
          boxShadow: mode === 'dark' ? '0 4px 20px 0 rgba(255, 255, 255, 0.1)' : '0 2px 4px rgba(0,0,0,0.1)',
          borderRadius: 12,
          margin: '8px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          margin: '8px 0',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: mode === 'dark' ? colors.dark.primary : colors.light.primary, // This maintains link visibility in both modes
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

export default getTheme;
