from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from huoguoml.server.entity import Base


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
