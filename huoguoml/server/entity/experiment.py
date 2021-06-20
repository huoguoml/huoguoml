from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship, validates

from huoguoml.server.entity import Base


class ExperimentORM(Base):
    __tablename__ = "experiments"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String)

    name = Column(String, index=True, unique=True, nullable=False)
    runs = relationship("RunORM", back_populates="experiment", order_by="desc(RunORM.run_nr)")

    @validates('name')
    def convert_upper(self, key, value):
        self.lower = value.lower()
        return self.lower
