from flask import Flask, request, render_template_string, redirect, url_for, g
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
        self.password = generate_password_hash(password)  # 비밀번호 해시 저장

@app.teardown_appcontext
def close_connection(exception):
    db_instance = getattr(g, '_database', None)
    if db_instance is not None:
        db_instance.close()

from page.main_page import main_page_code
@app.route('/')
def hello_world():
    return render_template_string(main_page_code)

from page.login_page import login_page_code
@app.route("/login", methods=['GET'])
def login_page():
    return render_template_string(login_page_code)

from page.signup_page import signup_page_code
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

if __name__ == '__main__':
    app.run(debug=True)
