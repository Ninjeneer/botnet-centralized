from flask import Flask, request, Response
import os, json
app = Flask(__name__)
zombies = ["192.168.10.5", "10.104.12.10"]


@app.route('/', methods=["GET"])
def register_machine():
    if request.remote_addr not in zombies:
        zombies.append(request.remote_addr)
        for item in zombies:
            infect(item)
    response = zombies.copy()
    response.remove(request.remote_addr)
    return Response(json.dumps({"IP": request.remote_addr, "Zombies": response}), 200)

def infect(ip):
    print(ip)


if __name__ == '__main__':
    app.run(run="0.0.0.0",debug=true)
