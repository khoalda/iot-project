import axios from 'axios';

const backendInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
});

export const getCurrentData = async (feed) => {
  const response = await backendInstance.get(`/api/data/current?feed=${feed}`)
  return response.data.value
};


export const setFan = (value) => backendInstance.post("/api/data/setfan", value);
export const setLed = (value) => backendInstance.post("api/data/setlight", value);



export const get24SolidTemperatures = () => backendInstance.get("api/data/daytemperatures");
export const get24SolidHumidities = () => backendInstance.get("api/data/dayhumidities");