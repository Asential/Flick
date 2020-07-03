import os
import collections
from datetime import datetime
import json
from flask import Flask, render_template, redirect, jsonify, request, url_for, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_session import Session
from json import JSONEncoder

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"

socketio = SocketIO(app)
Session(app)

usernames=[]
channelsList=[]
channelNames=[]
currentID = 0
global currentMessageID
currentMessageID = 0

class Channels():
     def __init__(self, name, messages, channelid):
         self.name = name
         self.messages = messages
         self.channelid = channelid

class Message():
     def __init__(self, content, user, time):
         self.content = content
         self.user = user
         self.time = time


class L(list):
     def append(self, item):
         list.append(self, item)
         if len(self) > 100: del self[0]

class MessageEncoder(JSONEncoder):
        def default(self, o):
            return o.__dict__

general = Channels('General', [], len(channelsList))
general.messages = L()
channelsList.append(general)
channelNames.append(general.name)

@app.route('/')
def user():
    global currentID
    if 'username' in session:
        return redirect(url_for('channels', channel_id=currentID))
    return render_template("user.html")

@app.route('/login', methods=['POST', 'GET'])
def login():
    global currentID
    username = request.form["username"]
    if username in usernames or username == '':
        return redirect(url_for('/'))
    usernames.append(username)
    session['username'] = username
    return redirect(url_for('channels', channel_id=currentID))
    
@app.route('/channels/<int:channel_id>')
def channels(channel_id):
    global currentID 
    currentID = channel_id
    if session['username'] == None:
        redirect(url_for('user'))
    username = session['username']
    socketio.emit('message id', channel_id)
    return render_template("channel.html", channelsList = channelsList, currentChannelID = channel_id, username = username)

@app.route('/logout.html', methods=['POST'])
def logout():
    user = session['username']
    usernames.remove(user)
    session.pop('username', None)
    return redirect(url_for('user'))

@socketio.on('channel')
def channel(name):
    global currentID 

    if name == '':
        return "Channel Can't be empty"
    for i in channelNames:
        if name == i:
            return "Channel already exists"
    channel = Channels(name, [], len(channelsList))
    channel.messages = L()
    channelsList.append(channel)
    channelNames.append(channel.name)
    emit('current channel', currentID)
    emit('change list', channelNames, broadcast=True)

@socketio.on('message')
def message(msg):
    # global currentID
    global currentMessageID
    messageID = currentMessageID
    username = session['username']
    
    for i in channelsList:
        if i.channelid == int(messageID):
            currentChannel = i.messages
    dateTimeObj = datetime.now()
    ts = str(dateTimeObj.day) + '/' + str(dateTimeObj.month) + '/' + str(dateTimeObj.year)  + ' (' + str(dateTimeObj.hour) + ':' + str(dateTimeObj.minute) + ')'
    newMessage = Message(msg, username, ts)
    currentChannel.append(newMessage)
    messageJSONData = json.dumps(currentChannel, cls=MessageEncoder)
    emit('message list', messageJSONData, broadcast=True)
    emit('scroll bottom')

@socketio.on('delete message')
def delete(messageData):
    global currentMessageID
    messageID = currentMessageID
    username = session['username']

    for i in channelsList:
        if i.channelid == int(messageID):
            currentChannel = i.messages 
    for m in currentChannel:
        checker = str(m.user)+str(m.content)+str(m.time)
        if checker == messageData:
            currentChannel.remove(m)
    emit('message channel', int(currentMessageID), broadcast=True)
    messageJSONData = json.dumps(currentChannel, cls=MessageEncoder)
    emit('message list', messageJSONData, broadcast=True)

@socketio.on('message id')
def setMessageID(data):
    global currentMessageID
    currentMessageID = data
    emit('message channel', int(currentMessageID), broadcast=True)