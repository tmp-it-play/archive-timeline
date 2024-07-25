from flask import Flask, send_from_directory
import os
app = Flask(__name__)

@app.route('/',methods=['GET'])
def welcome():
    return send_from_directory(app.static_folder,'index.html')
@app.route('/ai',methods=['GET'])
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':
    app.run()
