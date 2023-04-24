import time
import sys
from simple_ai import *
from Adafruit_IO import MQTTClient
from uart import *

AIO_FEED_ID = ["button1", "button2"]
AIO_USERNAME = "vovinh"
AIO_KEY = "aio_YMpF95wsYdKskEXGV9QiqhXThCuH"


def connected(client):
    print("Ket noi thanh cong...")
    for topic in AIO_FEED_ID:
        client.subscribe(topic)


def subscribe(client, userdata, mid, granted_qos):
    print("Subcribe thanh cong...")


def disconnected(client):
    print("Ngat ket noi...")
    sys.exit(1)


def message(client, feed_id, payload):
    if feed_id == "button1":
        if payload == "0":
            print("Led turned off")
            writeData("B")
        else:
            print("Led turned on")
            writeData("A")
    if feed_id == "button2":
        if payload == "0":
            print("Pumper turn off")
            writeData("F")
        else:
            print("Pumper turn on")
            writeData("E")


client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()
counter_ai = 5

while True:
    readSerial(client)
    counter_ai = counter_ai - 1
    if counter_ai == 0:
        counter_ai = 5
        ai_result = imageDetector()
        print("AI Output: ", ai_result)
        client.publish("ai", ai_result)
    time.sleep(1)
