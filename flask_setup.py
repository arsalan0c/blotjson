from flask import Flask, render_template
import json
import threading, webbrowser,time,socket


#check if file is json
def is_json(my_json):
    try:
        json_object = json.loads(my_json)
    except ValueError as e:
        return False
    return True


# initialize Flask
app = Flask(__name__)


@app.route('/')
def index():
    """Serve the index HTML"""
    return render_template('index.html')


if __name__ == "__main__":
    port = 5000 + random.randint(0, 999)
    url = "http://127.0.0.1:{0}".format(port)

    threading.Timer(1.25, lambda: webbrowser.open(url)).start()

    app.run(port=port, debug=False)

