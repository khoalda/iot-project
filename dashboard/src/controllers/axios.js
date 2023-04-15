import axios from 'axios';

const API_URL = process.env.REACT_APP_ADAFRUIT_API_URL

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "X-AIO-Key": `${process.env.REACT_APP_ADAFRUIT_KEY}`,
    "Content-Type": "application/json",
  },
});

export const fetchLastData = async (feed_key) => {
  const url = `/feeds/${feed_key}/data/last`;

  try {
    const response = await instance.get(url);

    return response.data.value;
  } catch (error) {
    console.error(error);
    return null;
  }
};
