FROM alpine:latest

RUN apk update && apk add python3 python3-dev python3-pip

ADD . /app/
WORKDIR /app

RUN python3 -m pip install -r requirements.txt
CMD python3 app.py