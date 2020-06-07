from flask_socketio import SocketIO, emit, send
from flask import Flask, render_template, url_for, copy_current_request_context
from threading import Thread, Event

app = Flask(__name__)
app.secret_key('change later')
socketio = SocketIO(app)


@app.route('/')
def index():
    # only by sending this page first will the client be connected to the socketio instance
    return render_template('index.html')


@socketio.on('connect', namespace='/test')
def test_connect():
    # need visibility of the global thread object
    global thread
    print('Client connected')


@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')


@socketio.on('json')
def handle_json(json):
    print('received json: ' + str(json))
    send(json)


if __name__ == "__main__":
    socketio.run(app,debug=True)
