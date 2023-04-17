import axios from 'axios';

// REST
const API_URL = process.env.REACT_APP_ADAFRUIT_API_URL

const adafruitInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "X-AIO-Key": `${process.env.REACT_APP_ADAFRUIT_KEY}`,
    "Content-Type": "application/json",
  },
});

export const fetchLastData = async (feed_key) => {
  const url = `/feeds/${feed_key}/data/last`;

  try {
    const response = await adafruitInstance.get(url);

    return response.data.value;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchHourlyAverage = async (feed_key, hours) => {
  const url = `${API_URL}/feeds/${feed_key}/data/chart?hours=${hours}`;
  const response = await adafruitInstance.get(url);
  const data = response.data;

  const hourlyData = {};
  data.data.forEach((point) => {
    const timestamp = new Date(point[0]).getTime();
    const hour = new Date(timestamp).getHours();
    const value = parseFloat(point[1]);
    if (!hourlyData[hour]) {
      hourlyData[hour] = {
        sum: 0,
        count: 0,
      };
    }
    hourlyData[hour].sum += value;
    hourlyData[hour].count++;
  });

  const hourlyAverages = [];
  for (let i = 0; i < hours; i++) {
    const hour = (new Date(Date.now() - i * 60 * 60 * 1000)).getHours();
    if (hourlyData[hour]) {
      hourlyAverages.unshift({
        x: `${hour}h`,
        y: hourlyData[hour].sum / hourlyData[hour].count,
      });
    } else {
      hourlyAverages.unshift({
        x: `${hour}h`,
        y: 0,
      });
    }
  }

  return hourlyAverages;
};




// MQTT
const backendInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export const getCurrentData = async (feed) => {
  const response = await backendInstance.get(`/api/data/current?feed=${feed}`)
  return response.data.value
};


export const updateFan = async (value) => {
  try {
    const response = await backendInstance.post("/api/data/setfan", { value: value })
    return response.data
  }
  catch (error) {
    console.log(error)
  }
};

export const updateLed = async (value) => {
  try {
    const response = await backendInstance.post("/api/data/setled", { value: value })
    return response.data
  }
  catch (error) {
    console.log(error)
  }
};



export const get24SolidTemperatures = () => backendInstance.get("api/data/daytemperatures");
export const get24SolidHumidities = () => backendInstance.get("api/data/dayhumidities");