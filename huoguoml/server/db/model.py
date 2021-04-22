"""
The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates

Base = declarative_base()


class RunORM(Base):
    __tablename__ = "runs"

    id = Column(String, primary_key=True, index=True)
    description = Column(String, unique=False, nullable=True)
    author = Column(String, unique=False, nullable=True)
    run_nr = Column(Integer, index=True)
    creation_time = Column(Float)
    experiment = relationship("ExperimentORM", back_populates="runs")
    experiment_name = Column(String, ForeignKey("experiments.name"))


class ExperimentORM(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, unique=False, nullable=True)
    name = Column(String, index=True, unique=True, nullable=False)
    runs = relationship("RunORM", back_populates="experiment")

    @validates('name')
    def convert_upper(self, key, value):
        return value.lower()


class ServiceORM(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    host = Column(String)
    port = Column(Integer)
    model = relationship("ModelORM", uselist=False, back_populates="service")


class ModelORM(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key=True, index=True)
    runs = relationship("RunORM", back_populates="ml_model")
    service = relationship("ServiceORM", back_populates="model")

