"""
The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Float, PickleType
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates

Base = declarative_base()


class RunORM(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    run_nr = Column(Integer, index=True)

    creation_time = Column(Float)
    finish_time = Column(Float)
    duration = Column(Float)

    status = Column(Integer)
    description = Column(String)
    author = Column(String)

    parameters = Column(PickleType)
    metrics = Column(PickleType)
    tags = Column(PickleType)
    model_definition = Column(PickleType)

    experiment = relationship("ExperimentORM", back_populates="runs")
    experiment_name = Column(String, ForeignKey("experiments.name"))

    ml_model = relationship("MLModelORM", uselist=False, back_populates="run")

    @validates('experiment_name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower


class ExperimentORM(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)
    name = Column(String, index=True, unique=True, nullable=False)
    runs = relationship("RunORM", back_populates="experiment")

    @validates('name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower


class MLServiceORM(Base):
    __tablename__ = "ml_services"

    id = Column(Integer, primary_key=True, index=True)
    host = Column(String)
    port = Column(Integer)
    model_rule = Column(String)
    model_version = Column(String)
    model_name = Column(String)

    model_id = Column(String, ForeignKey('ml_models.id'), nullable=False)
    model = relationship("MLModelORM", back_populates="ml_services")


class MLModelORM(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    version = Column(Integer, index=True)
    tag = Column(Integer)

    run_id = Column(Integer, ForeignKey('runs.id'), unique=True)
    run = relationship("RunORM", back_populates="ml_model")

    ml_services = relationship("MLServiceORM",
                               back_populates="model")

    @validates('name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower
