"""
The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy
"""

from sqlalchemy import Column, Integer, String, ForeignKey, Float, PickleType, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, validates

Base = declarative_base()

run_ml_model_association = Table('run_ml_model_association', Base.metadata,
                                 Column('run_id', Integer, ForeignKey('runs.id')),
                                 Column('ml_model_name', Integer, ForeignKey('ml_models.name'))
                                 )


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

    ml_model = relationship("MLModelORM", back_populates="runs", secondary=run_ml_model_association )

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


class ServiceORM(Base):
    __tablename__ = "ml_services"

    id = Column(Integer, primary_key=True, index=True)
    host = Column(String)
    port = Column(Integer)


class MLModelORM(Base):
    __tablename__ = "ml_models"

    name = Column(String, primary_key=True, index=True, unique=True)
    runs = relationship("RunORM", back_populates="ml_model", secondary=run_ml_model_association)

    @validates('name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower
