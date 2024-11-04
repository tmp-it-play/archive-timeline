from flask import Flask, request, render_template_string, redirect, url_for, g
from flask_sqlalchemy import SQLAlchemy
from config.config import Config
from werkzeug.security import check_password_hash

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    return app

app = create_app()

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

from page.main_page import main_page_code
@app.route('/')
def hello_world():
    return render_template_string(main_page_code)

from page.login_page import login_page_code
@app.route("/login",methods=['GET'])
def login_page():
    return render_template_string(login_page_code)

from page.signup_page import signup_page_code
@app.route("/signup",methods=['GET'])
def signup_page():
    return render_template_string(signup_page_code)

from model import User

@app.route("/login", methods=['POST'])
def login():
    user_id = request.form.get('ID')
    password = request.form.get('Password')

    # 사용자 정보 조회
    user = User.query.filter_by(user_id=user_id).first()

    if user and check_password_hash(user.password, password):
        return redirect(url_for('welcome'))  # 로그인 성공 시 환영 페이지로 리디렉션
    else:
        return "로그인 실패. 다시 시도해주세요.", 401  # 로그인 실패 시 메시지 반환

@app.route("/welcome")
def welcome():
    return "로그인 성공! 환영합니다."

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)