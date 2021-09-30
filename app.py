from flask import Flask, request, Response
import os, json
import socketio


app = Flask(__name__)
sio = socketio.AsyncServer()
sockets = []

@sio.event
def connect(sid, environ, auth):
    sockets.append(sid)

@sio.event
def disconnect(sid):
    sockets.remove(sid)

@app.route('/', methods=["GET", "POST"])
def command_control():
    print(request.get_json())
    if sockets:
        for s in sockets:
            sio.emit("command", request.get_json(),room=s)
    return "Done"

if __name__ == '__main__':
    app.run(run="0.0.0.0",debug=true)
