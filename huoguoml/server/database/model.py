"""
The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates

Base = declarative_base()


class Run(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True, index=True)
    description = Column(String, unique=False, nullable=True)
    author = Column(String, unique=False, nullable=True)
    run_nr = Column(Integer, index=True)
    creation_time = Column(Float)
    experiment = relationship("Experiment", back_populates="runs")
    experiment_name = Column(String, ForeignKey("experiments.name"))


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, unique=False, nullable=True)
    name = Column(String, index=True, unique=True, nullable=False)
    runs = relationship("Run", back_populates="experiment")

    @validates('name')
    def convert_upper(self, key, value):
        return value.lower()


class MLService(Base):
    __tablename__ = "ml_services"

    id = Column(Integer, primary_key=True, index=True)
    host = Column(String)
    port = Column(Integer)
    run_id = Column(String, ForeignKey("runs.id"))
