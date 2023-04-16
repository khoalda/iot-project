import axios from 'axios';

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