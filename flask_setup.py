from flask import Flask, render_template
import json
import webbrowser
from threading import Timer


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


def open_browser():
    webbrowser.open_new('http://127.0.0.1:1235/')


if __name__ == "__main__":
    Timer(1, open_browser).start();
    app.run(port=1235)
