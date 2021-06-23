"""
The huoguoml.repository module contains the classes for all database operations
"""

from typing import Dict

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

from huoguoml.server.entity import Base


class Repository(object):
    """The Repository object is responsible for the connection to the database.
    """

    def __init__(self, database_url: str, connect_args: Dict):
        engine = create_engine(
            database_url, connect_args=connect_args
        )
        session_factory = sessionmaker(bind=engine)
        self.Session = scoped_session(session_factory)
        Base.metadata.create_all(bind=engine)
