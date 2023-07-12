#!/usr/bin/python3
""" holds class User"""

import models
from models.base_model import BaseModel, Base
from os import getenv
from sqlalchemy import Column, String, UniqueConstraint, Boolean
from hashlib import md5


class User(BaseModel, Base):
    """Representation of a user """
    if models.storage_t == 'db':
        __tablename__ = 'users'
        password = Column(String(128), nullable=False)
        username = Column(String(128), nullable=False, unique=True)
        __table_args__ = (UniqueConstraint(
            'username', name='unique_username'),)
    else:
        username = ""
        password = ""
        gamestate = False

    def __init__(self, *args, **kwargs):
        """initializes user"""
        super().__init__(*args, **kwargs)

    def __setattr__(self, name, value):
        """sets a password with md5 encryption"""
        if name == "password":
            value = md5(value.encode()).hexdigest()
        super().__setattr__(name, value)
