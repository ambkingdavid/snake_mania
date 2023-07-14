#!/usr/bin/python3
from models import storage
from models.user import User
from flask import Flask, render_template, request, jsonify
from hashlib import md5
import uuid

app = Flask(__name__, static_url_path='/static')


@app.route('/')
def home():
    return render_template('home.html')


@app.route('/snake')
def snake():
    return render_template('snake.html')

@app.route('/user/<user_id>')
def get_user(user_id):
    cache_id = str(uuid.uuid4())

    return render_template('user.html',
                           user=user_id,
                           cache_id=cache_id)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
