from flask import Flask, render_template_string
from flask_sqlalchemy import SQLAlchemy

from config.config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    return app

app = create_app()

@app.route('/')
def hello_world():
    return 'Hello World!'

from page.login_page import login_page_code
@app.route("/login",methods=['GET'])
def login_page():
    return render_template_string(login_page_code)

from page.signup_page import signup_page_code
@app.route("/signup",methods=['GET'])
def signup_page():
    return render_template_string(signup_page_code)

@app.route("/login",methods=['POST'])
def login():
    print("login")
    return "login"

if __name__ == '__main__':
    app.run(debug=True)