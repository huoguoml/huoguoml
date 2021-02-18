"""
The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy
"""
import time

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Run(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True)
    run_nr = Column(Integer)
    creation_time = Column(Float, default=time.time)
    experiment = relationship("Experiment", back_populates="runs")
    experiment_name = Column(String, ForeignKey("experiments.name"))


class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    runs = relationship("Run", back_populates="experiment")
