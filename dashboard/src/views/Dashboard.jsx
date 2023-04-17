import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Switch,
  Slider,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import LineChart from "../components/LineChart";
import { useState, useEffect } from "react";
import { fetchLastData, updateFan, updateLed } from "../controllers/axios";

import io from "socket.io-client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb as lightbulbOn,
  faFan,
  faTemperatureThreeQuarters,
  faDroplet,
} from "@fortawesome/free-solid-svg-icons";

import { faLightbulb as lightbulbOff } from "@fortawesome/free-regular-svg-icons";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [temp, setTemp] = useState("0");
  const [humid, setHumid] = useState("0");
  const [fan, setFan] = useState("0");
  const [led, setLed] = useState(0);
  const [ai, setAi] = useState("0");

  const [ledLoading, setLedLoading] = useState(true);
  const [fanLoading, setFanLoading] = useState(true);
  const [tempLoading, setTempLoading] = useState(true);
  const [humidLoading, setHumidLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(true);

  const [savingLed, setSavingLed] = useState(false);
  const [savingFan, setSavingFan] = useState(false);

  const [logs, setLogs] = useState([]);

  const pushLog = (log) => {
    setLogs((prevLogs) => [log, ...prevLogs]);
  };

  useEffect(() => {
    (async () => {
      const currentTemp = await fetchLastData("temp");
      setTemp(currentTemp);
      setTempLoading(false);

      const currentHumid = await fetchLastData("humid");
      setHumid(currentHumid);
      setHumidLoading(false);

      const currentFan = await fetchLastData("fan");
      setFan(currentFan);
      setFanLoading(false);

      const currentLed = await fetchLastData("led");
      setLed(parseInt(currentLed));
      setLedLoading(false);

      const currentAi = await fetchLastData("ai");
      setAi(currentAi);
      setAiLoading(false);
    })();
  }, []);

  useEffect(() => {
    console.log("Current data:", { temp, humid, fan, led, ai });
  }, [temp, humid, fan, led, ai]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("tempUpdate", ({ temp }) => {
      console.log("Received data:", temp);
      setTemp(temp);
      pushLog({
        title: "Temperature",
        time: new Date().toLocaleTimeString(),
        value: `${temp}°C`,
      });
    });
    socket.on("humidUpdate", ({ humid }) => {
      console.log("Received data:", humid);
      setHumid(humid);
      pushLog({
        title: "Humidity",
        time: new Date().toLocaleTimeString(),
        value: `${humid}%`,
      });
    });
    socket.on("fanUpdate", ({ fan }) => {
      console.log("Received data:", fan);
      setFan(fan);
      pushLog({
        title: "Fan speed",
        time: new Date().toLocaleTimeString(),
        value: `${fan}%`,
      });
    });
    socket.on("ledUpdate", ({ led }) => {
      console.log("Received data:", led);
      setLed(led);
      pushLog({
        title: "Led",
        time: new Date().toLocaleTimeString(),
        value: led ? "On" : "Off",
      });
    });
    socket.on("aiUpdate", ({ ai }) => {
      console.log("Received data:", ai);
      setAi(ai);
      pushLog({
        title: "AI Result",
        time: new Date().toLocaleTimeString(),
        value: ai,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Box m="20px">
      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
          position="relative"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                // height: "1em",
                marginRight: "0.5em",
              }}
            >
              {led ? (
                <FontAwesomeIcon icon={lightbulbOn} beat />
              ) : (
                <FontAwesomeIcon icon={lightbulbOff} />
              )}
            </span>
            Led
          </h1>
          {ledLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              size={24}
              color="secondary"
            />
          ) : (
            <Switch
              color="secondary"
              checked={led === 1}
              onChange={async () => {
                setSavingLed(true); // set loading state to true
                const newLedState = led ? 0 : 1;
                await updateLed(newLedState.toString());
                setLed(!led);
                setSavingLed(false); // set loading state to false
              }}
              value={led}
            />
          )}

          {savingLed && (
            <CircularProgress
              sx={{
                position: "absolute",
                top: 0, // position spinner on top right corner
                right: 0,
                marginTop: 2, // add margin to adjust position
                marginRight: 2,
              }}
              size={24}
              color="secondary"
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
          position="relative"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
              <FontAwesomeIcon icon={faFan} spin={fan != 0} />
            </span>
            Fan
          </h1>
          {fanLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Slider
              aria-label="Always visible"
              value={parseInt(fan)}
              step={1}
              marks={[
                {
                  value: 0,
                  label: "0",
                },
                {
                  value: 20,
                  label: "20",
                },
                {
                  value: 50,
                  label: "50",
                },
                {
                  value: 100,
                  label: "Max",
                },
              ]}
              valueLabelDisplay="on"
              sx={{ width: "80%" }}
              color="secondary"
              onChange={async (event, newValue) => {
                setSavingFan(true);
                await updateFan(newValue.toString());
                setFan(newValue);
                setSavingFan(false);
              }}
            />
          )}

          {savingFan && (
            <CircularProgress
              sx={{
                position: "absolute",
                top: 0, // position spinner on top right corner
                right: 0,
                marginTop: 2, // add margin to adjust position
                marginRight: 2,
              }}
              color="secondary"
              size={24}
            />
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                // height: "1em",
                marginRight: "0.5em",
              }}
            >
              <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </span>
            Temperature
          </h1>
          {tempLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {temp} °C
            </Typography>
          )}
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          flexDirection="column"
        >
          <h1
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                marginRight: "0.5em",
              }}
            >
              <FontAwesomeIcon icon={faDroplet} />
            </span>
            Humidity
          </h1>
          {humidLoading ? (
            <CircularProgress
              sx={{
                marginBottom: 2,
              }}
              color="secondary"
              size={24}
            />
          ) : (
            <Typography
              variant="h3"
              fontWeight="bold"
              color={colors.greenAccent[500]}
            >
              {humid} %
            </Typography>
          )}
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Line chart
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                Last 12hrs
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{
                    fontSize: "26px",
                    color: colors.greenAccent[500],
                  }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Logs
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setLogs([]);
              }}
            >
              Clear Logs
            </Button>
          </Box>
          {logs.map((log, i) => (
            <Box
              key={i}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box
                sx={{
                  width: "30%",
                }}
              >
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {log.title}
                </Typography>
              </Box>
              <div></div>
              <Box
                color={colors.grey[100]}
                sx={{
                  width: "30%",
                }}
              >
                {log.time}
              </Box>
              <Box
                sx={{
                  width: "40%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  backgroundColor={colors.greenAccent[500]}
                  p="5px 10px"
                  borderRadius="4px"
                  width="fit-content"
                >
                  {log.value}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          flexGrow={1}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                AI Result
              </Typography>
              {aiLoading ? (
                <CircularProgress
                  sx={{
                    marginBottom: 2,
                  }}
                  color="secondary"
                  size={24}
                />
              ) : (
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  {ai}
                </Typography>
              )}
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0"></Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
