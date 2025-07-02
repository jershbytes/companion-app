import React, { useEffect, useState } from "react";
import { Button, Box, Typography, Paper, List, ListItem, ListItemText, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Admin() {
  const { logout } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/results")
      .then(res => setResults(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    await axios.delete(`/api/results/${id}`);
    setResults(results => results.filter(r => r.id !== id));
  };

  if (loading) return <Box mt={5} textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Admin Panel</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>
          Logout
        </Button>
      </Box>
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
                <Button color="error" onClick={e => { e.preventDefault(); e.stopPropagation(); handleDelete(result.id); }}>
                  Delete
                </Button>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
}
