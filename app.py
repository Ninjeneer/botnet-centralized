from flask import Flask, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
sio = SocketIO(app)


@sio.on('connect')
def connect():
    print("Socket connected")


@sio.event
def disconnect():
    print("Socket disconnected")


@app.route('/', methods=["POST"])
def command_control():
    print(request.get_json())
    emit("command", request.get_json(), namespace="/", broadcast=True)
    return "Done"


if __name__ == '__main__':
    sio.run(app)
