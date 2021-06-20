from sqlalchemy import Column, Integer, String, ForeignKey, Float, PickleType
from sqlalchemy.orm import relationship, validates

from huoguoml.server.entity import Base


class RunORM(Base):
    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, index=True, unique=True)
    run_nr = Column(Integer, index=True)

    creation_time = Column(Float)
    finish_time = Column(Float)
    last_modification = Column(Float)
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
