#!/usr/bin/python3
""" objects that handle all default RestFul API actions for Users """
from models.user import User
from models import storage
from api.v1.views import app_views
from flask import abort, jsonify, make_response, request
from flasgger.utils import swag_from
from hashlib import md5
import json


@app_views.route('/users', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/all_users.yml')
def get_users():
    """
    Retrieves the list of all user objects
    or a specific user
    """
    all_users = storage.all(User).values()
    list_users = []
    for user in all_users:
        list_users.append(user.to_dict())
    return jsonify(list_users)


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/user/get_user.yml', methods=['GET'])
def get_user(user_id):
    """ Retrieves an user """
    user = storage.get(User, user_id)
    if not user:
        abort(404)

    return jsonify(user.to_dict())


@app_views.route('/users/<user_id>', methods=['DELETE'],
                 strict_slashes=False)
@swag_from('documentation/user/delete_user.yml', methods=['DELETE'])
def delete_user(user_id):
    """
    Deletes a user Object
    """

    user = storage.get(User, user_id)

    if not user:
        abort(404)

    storage.delete(user)
    storage.save()

    return make_response(jsonify({}), 200)


@app_views.route('/users', methods=['POST'], strict_slashes=False)
@swag_from('documentation/user/post_user.yml', methods=['POST'])
def post_user():
    """
    Creates a user
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'username' not in request.get_json():
        abort(400, description="Missing username")
    if 'password' not in request.get_json():
        abort(400, description="Missing password")
    if 'email' not in request.get_json():
        abort(400, description="Missing email")

    data = request.get_json()
    instance = User(**data)
    instance.save()
    print(f"{data['password']}: {instance.password}")
    return make_response(jsonify(instance.to_dict()), 201)


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/user/put_user.yml', methods=['PUT'])
def put_user(user_id):
    """
    Updates a user
    """
    user = storage.get(User, user_id)

    if not user:
        abort(404)

    if not request.get_json():
        abort(400, description="Not a JSON")

    ignore = ['id', 'email', 'created_at', 'updated_at']

    data = request.get_json()
    for key, value in data.items():
        if key not in ignore:
            setattr(user, key, value)
    storage.save()
    return make_response(jsonify(user.to_dict()), 200)


@app_views.route('/users/get_user', methods=['POST'], strict_slashes=False)
@swag_from('documentation/user/post_user.yml', methods=['POST'])
def retrieve_user():
    """
    Retrieves a user
    """
    if not request.get_json():
        abort(400, description="Not a JSON")

    if 'username' not in request.get_json():
        abort(400, description="Missing username")
    if 'password' not in request.get_json():
        abort(400, description="Missing password")

    data = request.get_json()
    username = data['username']
    user_passwd = data['password']
    passwd = md5(user_passwd.encode()).hexdigest()
    print(f"{user_passwd}: {passwd}")
    users = storage.all(User).values()
    with open('file.json', 'r') as file:
      data = json.load(file)
    user = None
    for u in users:
        if u.username == username:
            user = u
            break
    key = f"{user.__class__.__name__}.{user.id}"
    log_user = data[key]
    print(user)
    if log_user['password'] == passwd:
        return make_response(jsonify(user.to_dict()), 201)
    else:
        abort(401, description="Invalid username or password")
