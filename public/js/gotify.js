import axios from 'axios';
import dotenv from 'dotenv';
import dedent from 'dedent';

dotenv.config(); // Load environment variables

const GOTIFY_URL = process.env.GOTIFY_URL; // URL for the Gotify API

// Function to send Gotify notification
export const sendGotifyNotification = async (message) => {
  try {
    const response = await axios.post(GOTIFY_URL, {
      message: message,
    });

    console.log('Gotify Notification Sent:', response.data);
    return response.data; // Return the response for further processing
  } catch (error) {
    console.error('Error sending Gotify notification:', error.response?.data || error.message);
    throw error; // Throw the error for handling in the calling function
  }
};

export const notifyFromForm = async (formData) => {
  try {
    const { fullname } = formData;

    if (!fullname) {
      throw new Error('Missing required field: fullname');
    }

    const message = `Hey, you got a submission from ${fullname}, Check it out in your email!`;

    return await sendGotifyNotification(message);
  } catch (error) {
    console.error('Error in notifyFromForm:', error.message);
    throw error;
  }
};