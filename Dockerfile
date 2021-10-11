FROM debian:11

RUN apt update && apt install python3 python3-pip -y

ADD . /app/
WORKDIR /app

RUN python3 -m pip install -r requirements.txt
CMD python3 app.py