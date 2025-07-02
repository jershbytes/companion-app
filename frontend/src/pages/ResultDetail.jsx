import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Typography, Box, Paper, CircularProgress, Alert, Button } from '@mui/material';
import axios from 'axios';

function renderField(label, value) {
  if (!value) return null;
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{value}</Typography>
    </Box>
  );
}

export default function ResultDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    axios.get(`/api/results/${id}`)
      .then(res => setResult(res.data))
      .catch(e => setError(e.response?.status === 404 ? "Result not found" : e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this result? This action cannot be undone.")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/results/${id}`);
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Box mt={5} textAlign="center"><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!result) return null;

  return (
    <Box mt={4}>
      <Button variant="outlined" component={RouterLink} to="/admin" sx={{ mb: 2 }}>← Back to Results</Button>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          {result.fullname || "Anonymous"}
        </Typography>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Submitted: {result.submittedAt}
        </Typography>
        <Box mt={2}>
          {renderField("Birthday", result.age)}
          {renderField("Email", result.email)}
          {renderField("Hobbies", result.hobbies)}
          {renderField("Favorite Food", result.favfood)}
          {renderField("What do you like about me?", result.question1)}
          {renderField("What is your ideal first date?", result.question2)}
          {renderField("How would we spend our perfect Saturday together?", result.question3)}
          {renderField("If you could describe our vibe, what would it be?", result.question4)}
          {renderField("What is your go-to strategy for cheering someone up after a long day?", result.question5)}
          {renderField("If we were starring in a movie together, what genre would it be and why?", result.question6)}
          {renderField("Have you ever been convicted of a crime? Please explain below.", result.hrq1)}
          {renderField("Do you use drugs recreationally outside of Weed, Tobacco, and vaping?", result.hrq2)}
          {renderField("Do you currently have hoes?", result.hrq3)}
          {renderField("Are there any long-standing situationships we need to be aware of?", result.hrq4)}
          {renderField("Are there kids involved? If so, what do they enjoy doing?", result.hrq5)}
          {renderField("Are you employed? If so, how long?", result.hrq6)}
          {renderField("How is your relationship with your family?", result.hrq7)}
          {renderField("Are you looking for a long-term relationship or a fling?", result.hrq8)}
          {renderField("What are your feelings on guy/girl friendships?", result.hrq9)}
        </Box>
        <Box mt={3} textAlign="right">
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete Result'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}