import { createTheme } from '@mui/material/styles';

const draculaPalette = {
  dark: {
    mode: 'dark',
    primary: { main: '#ff79c6' },      // Pink
    secondary: { main: '#8be9fd' },    // Cyan
    background: {
      default: '#282a36',              // Dracula background
      paper: '#44475a'                 // Dracula selection
    },
    error: { main: '#ff5555' },        // Red
    warning: { main: '#f1fa8c' },      // Yellow
    info: { main: '#8be9fd' },         // Cyan
    success: { main: '#50fa7b' }       // Green
  },
  light: {
    mode: 'light',
    primary: { main: '#bd93f9' },      // Purple
    secondary: { main: '#ffb86c' },    // Orange
    background: {
      default: '#f8f8f2',              // Dracula foreground
      paper: '#f1faee'                 // Light paper
    },
    error: { main: '#ff5555' },
    warning: { main: '#f1fa8c' },
    info: { main: '#8be9fd' },
    success: { main: '#50fa7b' }
  }
};

export const getTheme = (mode = 'dark') =>
  createTheme({
    palette: draculaPalette[mode],
    typography: {
      fontFamily: '"Quicksand", "Roboto", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 600 },
      h3: { fontWeight: 600 },
      h4: { fontWeight: 500 }
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            textTransform: 'none'
          }
        }
      }
    }
  });

// Optionally, you can still export the default as dark mode for legacy imports
export default getTheme('dark');