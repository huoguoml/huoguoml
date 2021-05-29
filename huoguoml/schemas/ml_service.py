from pydantic import BaseModel


class MLServiceIn(BaseModel):
    host: str
    port: int
    model_name: str
    model_rule: str


class MLService(MLServiceIn):
    id: int
    model_version: str

    class Config:
        orm_mode = True


class RequestLog(BaseModel):
    timestamp: int
    sender_host: str
    sender_port: int
    receiver_host: str
    receiver_port: int
    level: int
    message: str

    class Config:
        orm_mode = True
