---
description: Guide for creating services out of your machine learning models
---

# HuoguoML Serving

## Introduction

HuoguoML Serving is an external tool to create a REST service from your registered models. Furthermore, all HugouoML Serving services are logged to the HuoguoML dashboard, giving you an integrated monitoring solution. Besides, these services are written with FastAPI and can be extended to support other monitoring tools \(see: [Monitor HuoguoML Service](monitor-huoguoml-serving-service.md)\).

## Serving CLI

Creating a service with HuoguoML Serving is very simple. You just need to run `huoguoml serving` and enter the correct arguments, see below:

```text
Usage: huoguoml serving [OPTIONS]

Options:
  --host TEXT          The network address to listen on (default: 127.0.0.1).
  --port INTEGER       The port to listen on (default: 5000).
  --server_uri TEXT    The uri to the HuoguoML server
  --model_name TEXT    The name of the model that should be used
  --model_rule TEXT    The rule for pulling the model e.g. production for
                       always using the production model (default: latest).
                       Following rules are available: latest, staging,
                       production
```



