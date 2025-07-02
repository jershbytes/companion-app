import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Stack,
  Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const steps = [
  'Basic Information',
  'Basic Questionnaire',
  'Background Check',
];

const initialForm = {
  fullname: '',
  age: '',
  email: '',
  hobbies: '',
  favfood: '',
  question1: '',
  question2: '',
  question3: '',
  question4: '',
  question5: '',
  question6: '',
  hrq1: '',
  hrq2: '',
  hrq3: '',
  hrq4: '',
  hrq5: '',
  hrq6: '',
  hrq7: '',
  hrq8: '',
  hrq9: '',
};

export default function Questionnaire() {
  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Only advance on Next, never submit form except on last step
  const handleNext = (e) => {
    e.preventDefault(); // Prevent accidental form submission
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setError('');
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('/api/submit', form);
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
        err.message ||
        'Failed to submit. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5" color="primary" gutterBottom>
          💖 Thanks for submitting!
        </Typography>
        <Typography variant="body1">
          We'll be in touch soon!{' '}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" color="primary" textAlign="center" gutterBottom>
        💌 Companion Application
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>
      <form
        onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}
        autoComplete="off"
      >
        <Stack spacing={2}>
          {activeStep === 0 && (
            <>
              <Typography variant="h6">Basic Information</Typography>
              <TextField label="Name" name="fullname" value={form.fullname} onChange={handleChange} required fullWidth />
              <TextField label="Birthday (MM-DD-YYYY)" name="age" value={form.age} onChange={handleChange} fullWidth />
              <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required fullWidth />
              <TextField label="Hobbies" name="hobbies" value={form.hobbies} onChange={handleChange} fullWidth />
              <TextField label="Favorite Food" name="favfood" value={form.favfood} onChange={handleChange} fullWidth />
            </>
          )}
          {activeStep === 1 && (
            <>
              <Typography variant="h6">Basic Questionnaire</Typography>
              <TextField
                label="What do you like about me?"
                name="question1"
                value={form.question1}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="What is your ideal first date?"
                name="question2"
                value={form.question2}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="How would we spend our perfect Saturday together?"
                name="question3"
                value={form.question3}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="If you could describe our vibe, what would it be?"
                name="question4"
                value={form.question4}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="What is your go-to strategy for cheering someone up after a long day?"
                name="question5"
                value={form.question5}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="If we were starring in a movie together, what genre would it be and why?"
                name="question6"
                value={form.question6}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
            </>
          )}
          {activeStep === 2 && (
            <>
              <Typography variant="h6">Background Check</Typography>
              <TextField
                label="Have you ever been convicted of a crime? Please explain below."
                name="hrq1"
                value={form.hrq1}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Do you use drugs recreationally outside of Weed, Tobacco, and vaping?"
                name="hrq2"
                value={form.hrq2}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Do you currently have hoes?"
                name="hrq3"
                value={form.hrq3}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Are there any long-standing situationships we need to be aware of?"
                name="hrq4"
                value={form.hrq4}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Are there kids involved? If so, what do they enjoy doing?"
                name="hrq5"
                value={form.hrq5}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Are you employed? If so, how long?"
                name="hrq6"
                value={form.hrq6}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="How is your relationship with your family?"
                name="hrq7"
                value={form.hrq7}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="Are you looking for a long-term relationship or a fling?"
                name="hrq8"
                value={form.hrq8}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
              <TextField
                label="What are your feelings on guy/girl friendships?"
                name="hrq9"
                value={form.hrq9}
                onChange={handleChange}
                fullWidth multiline minRows={2}
              />
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
            <Button disabled={activeStep === 0 || loading} onClick={handleBack} type="button">
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                type="button"
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit 💌'}
              </Button>
            )}
          </Box>
        </Stack>
      </form>
    </Box>
  );
}