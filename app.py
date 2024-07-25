from flask import Flask, render_template, send_from_directory, jsonify, request
from test import gpt

app = Flask(__name__, static_folder='static', template_folder='templates')


@app.route('/')
def serve():
    return render_template('index.html')


@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory(app.static_folder, path)


@app.route('/ai', methods=['POST'])
def ai():
    data = request.get_json()
    result = gpt(data)
    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True)

