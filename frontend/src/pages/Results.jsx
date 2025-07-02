import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, List, ListItem, ListItemText, CircularProgress, Alert, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('/api/results')
      .then(res => setResults(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box mt={5} textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box mt={4}>
      <Typography variant="h4" color="primary" gutterBottom>
        Results
      </Typography>
      <Paper elevation={2} sx={{ mt: 2 }}>
        <List>
          {results.length === 0 ? (
            <ListItem>
              <ListItemText primary="No results yet!" />
            </ListItem>
          ) : (
            results.map(result => (
              <ListItem
                key={result.id}
                alignItems="flex-start"
                component={Link}
                to={`/results/${result.id}`}
                button
              >
                <ListItemText
                  primary={result.fullname || 'Anonymous'}
                  secondary={`Submitted: ${result.submittedAt || ''}`}
                />
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}