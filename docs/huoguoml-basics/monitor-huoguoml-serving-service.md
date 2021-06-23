---
description: Customize a HuoguoML service for external monitoring tools
---

# Monitor HuoguoML Serving Client

## Introduction

In most cases you want to monitor your services with external tools like Prometheus, Nagios, Zabbix or others. In order to do this with HuoguoML Serving, you need to extend the functionalities. And as the clients are children of fastapi.APIRouter, you can simply use common fastAPI functionalities. The following sections will go into how you can extend the serving client.

## Customize Serving client

The HuoguoML Serving client is a FastAPI router that can be integrated into any FastAPI application:

```python
from fastapi import FastAPI

from huoguoml.serving.api import HuoguoMLRouter

app = FastAPI()
huoguoml_router = HuoguoMLRouter(host=host, 
                                 port=port, 
                                 model_name=model_name, 
                                 model_rule=model_rule,
                                 server_uri=server_uri,
                                 artifact_dir=artifact_dir)

# add new endpoints before adding your router to the application                                 
app.include_router(router)
```

This allows you to add middleware and co using FastAPI. You can add another prediction endpoint with a logging functions or run additional tasks in the background with background tasks:

```python
from fastapi import FastAPI, BackgroundTasks

from huoguoml.serving.api import HuoguoMLRouter

app = FastAPI()
huoguoml_router = HuoguoMLRouter(host=host, 
                                 port=port, 
                                 model_name=model_name, 
                                 model_rule=model_rule,
                                 server_uri=server_uri,
                                 artifact_dir=artifact_dir)

def your_background_tasks(argument1, argument2):
    print(argument1)
    print(argument2)

@huoguoml_router.post("/customon/predict", response_model=HuoguoMLRouter.output_model)
async def predict(data: HuoguoMLRouter.input_model, background_tasks: BackgroundTask):
    prediction = huoguoml_router.model.predict(data)
    background_tasks.add_task(your_background_tasks, argument1="hello", argument2="word")
    return prediction
    
app.include_router(router)
```
