from sqlalchemy import Column, Integer, String, ForeignKey, Float
from sqlalchemy.orm import relationship, validates

from huoguoml.server.entity import Base


class MLModelORM(Base):
    __tablename__ = "ml_models"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    version = Column(String, index=True)
    tag = Column(Integer)
    creation_time = Column(Float)
    last_modification = Column(Float)

    run_id = Column(Integer, ForeignKey('runs.id'), unique=True)
    run = relationship("RunORM", back_populates="ml_model")

    ml_services = relationship("MLServiceORM",
                               back_populates="model")

    @validates('name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower
