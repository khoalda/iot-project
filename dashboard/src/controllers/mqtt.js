import mqtt from "mqtt";

const realtimeUpdate = (io) => {
    const host = `${process.env.REACT_APP_ADAFRUIT_MQTT_URL}`;
    const username = `${process.env.REACT_APP_ADAFRUIT_USERNAME}`;
    const key = `${process.env.REACT_APP_ADAFRUIT_KEY}`;

    const client = mqtt.connect(host, {
        username: username,
        password: key,
    });

    client.on("connect", () => {
        client.subscribe(`${username}/feeds/temp`);
        client.subscribe(`${username}/feeds/humid`);
        client.subscribe(`${username}/feeds/fan`);
        client.subscribe(`${username}/feeds/led`);
        client.subscribe(`${username}/feeds/ai`);
    });

    client.on("message", (topic, message) => {
        const data = parseFloat(message.toString());

        if (topic.endsWith("temp")) {
            io.emit("temperatureUpdate", { temperature: data });
            console.log(`Temperature: ${data}°C`);
        } else if (topic.endsWith("humid")) {
            io.emit("humidityUpdate", { humidity: data });
            console.log(`Humidity: ${data}%`);
        } else if (topic.endsWith("fan")) {
            io.emit("fanUpdate", { fan: data });
            console.log(`Fan: ${data}`);
        } else if (topic.endsWith("led")) {
            io.emit("lightUpdate", { light: data });
            console.log(`Light: ${data}`);
        } else if (topic.endsWith("ai")) {
            io.emit("aiUpdate", { ai: data });
            console.log(`Ai: ${data}`);
        }
    });
};

export default realtimeUpdate;
