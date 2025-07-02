import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function Home() {
  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h2" color="primary" gutterBottom>
        💌 Companion App
      </Typography>
      <Typography variant="h5" gutterBottom>
        A funny way to meet your next companion!
      </Typography>
      <Button
        component={RouterLink}
        to="/login"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 4 }}
      >
      </Button>
    </Box>
  );
}