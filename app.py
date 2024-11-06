import os
from flask import Flask, request, render_template_string, redirect, url_for, g, jsonify
from flask_sqlalchemy import SQLAlchemy
from config.config import Config
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()

    return app

app = create_app()
class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __init__(self, user_id, password):
        self.user_id = user_id
        self.password = generate_password_hash(password)

@app.teardown_appcontext
def close_connection(exception):
    db_instance = getattr(g, '_database', None)
    if db_instance is not None:
        db_instance.close()

from templates.main_page import main_page_code
@app.route('/')
def hello_world():
    return render_template_string(main_page_code)

from templates.login_page import login_page_code
@app.route("/login", methods=['GET'])
def login_page():
    return render_template_string(login_page_code)

from templates.signup_page import signup_page_code
@app.route("/signup", methods=['GET'])
def signup_page():
    return render_template_string(signup_page_code)

@app.route("/login", methods=['POST'])
def login():
    user_id = request.form.get('ID')
    password = request.form.get('Password')
    user = User.query.filter_by(user_id=user_id).first()
    if user and check_password_hash(user.password, password):
        return redirect(url_for('welcome'))
    else:
        return "로그인 실패. 다시 시도해주세요.", 401

@app.route("/welcome")
def welcome():
    return "로그인 성공! 환영합니다."

@app.route("/signup", methods=['POST'])
def signup():
    user_id = request.form.get('ID')
    password = request.form.get('Password')
    new_user = User(user_id=user_id, password=password)
    db.session.add(new_user)
    db.session.commit()
    return redirect(url_for('login_page'))

from templates.canvas_page import canvas_page_code
@app.route("/canvas")
def canvas():
    return render_template_string(canvas_page_code)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
file_counter = len(os.listdir(UPLOAD_FOLDER))

def get_next_filename():
    global file_counter
    file_counter += 1
    return f"{file_counter:05}.jpg"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file:
        filename = get_next_filename()
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        return jsonify({"message": "File saved successfully", "filepath": filepath}), 200

@app.route("/feed",methods=['GET'])
def feed():
    return "피드 페이지"

if __name__ == '__main__':
    app.run(debug=True)