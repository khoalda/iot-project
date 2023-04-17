import time
import sys
from Adafruit_IO import MQTTClient
from uart import *

AIO_FEED_ID = ["led", "fan"]
AIO_USERNAME = "csee_group"
AIO_KEY = "aio_qCEI29pylajpgXMMrxMR1tMl7TPr"

def  connected(client):
    print("Ket noi thanh cong...")
    for topic in AIO_FEED_ID:
        client.subscribe(topic)

def  subscribe(client , userdata , mid , granted_qos):
    print("Subcribe thanh cong...")

def  disconnected(client):
    print("Ngat ket noi...")
    sys.exit (1)

def  message(client , feed_id , payload):
    if feed_id == "led":
        if payload == "0":
            print("Led turned off")
            writeData("B")
        else:
            print("Led turned on")
            writeData("A")
    if feed_id == "fan":
        if payload == "0":
            print("Fan turn off")
            writeData("F" + payload)
        else:
            print("Set fan speed to " + payload + " %")
            writeData("F" + payload)

client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()


while True:
    readSerial(client)
    time.sleep(1)