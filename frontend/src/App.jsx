import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { ThemeProvider, CssBaseline, Container, IconButton, Box, Tooltip } from '@mui/material';
import { LightMode, DarkMode, Home as HomeIcon } from '@mui/icons-material';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Questionnaire from './pages/Questionnaire.jsx';
import Admin from './pages/Admin.jsx';
import ResultDetail from './pages/ResultDetail.jsx';
import Login from './pages/Login.jsx';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';
import { getTheme } from './theme/theme.js';

const ColorModeContext = createContext();

export function useColorMode() {
  return useContext(ColorModeContext);
}

function TopBar({ mode, toggleColorMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ position: 'relative', mb: 2 }}>
      {/* Home Button (don't show on root/questionnaire page) */}
      {location.pathname !== "/" && (
        <Tooltip title="Home">
          <IconButton
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mr: 1, position: 'absolute', left: 0 }}
            aria-label="Go to Home"
          >
            <HomeIcon />
          </IconButton>
        </Tooltip>
      )}
      {/* Theme Toggle */}
      <Tooltip title={mode === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
        <IconButton onClick={toggleColorMode} sx={{ position: 'absolute', right: 0 }}>
          {mode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default function App() {
  const getInitialMode = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('colorMode');
      return saved === 'light' || saved === 'dark' ? saved : 'dark';
    }
    return 'dark';
  };

  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    localStorage.setItem('colorMode', mode);
  }, [mode]);

  const theme = useMemo(() => getTheme(mode), [mode]);
  const toggleColorMode = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Container maxWidth="sm" sx={{ py: 4 }}>
            <TopBar mode={mode} toggleColorMode={toggleColorMode} />
            <Routes>
              <Route path="/" element={<Questionnaire />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:id"
                element={
                  <ProtectedRoute>
                    <ResultDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}