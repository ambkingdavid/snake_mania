#!/usr/bin/python3
""" holds class GameState"""
import models
from models.base_model import BaseModel, Base
from os import getenv
from sqlalchemy import Column, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship


class GameState(BaseModel, Base):
  """Representation of state """
  if models.storage_t == "db":
    __tablename__ = 'setup_state'
    state = Column(Boolean, nullable=False)
  else:
    state = False
    
  def __init__(self, *args, **kwargs):
    """initializes state"""
    super().__init__(*args, **kwargs)