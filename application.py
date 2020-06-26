import os
import datetime
from flask import Flask, render_template, redirect, jsonify, request, url_for, session
from flask_socketio import SocketIO, emit, send,join_room, leave_room
from flask_session import Session


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

socketio = SocketIO(app)
Session(app)
channels = []

channels={"general": []}
# channels['General']=[] 
# list of all channels except General
# channelsList=[]
# privateMessages={}
# usersList={}     
# limit=100

@app.route('/')
def index():
    return render_template("index.html", channel = channels)

@socketio.on('message')
def handleMessage(msg):
    
    print('Message: ' + msg)
    channels["general"].append(msg)
    print(channels)
    emit("channel", channels, broadcast=True)


