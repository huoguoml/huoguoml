# Welcome to HuoguoML!

## Introduction

HuoguoML is a framework for managing machine learning models. It provides a set of lightweight APIs that can be used with all existing machine learning applications. Current core features are:

* HuoguoML Tracking: An API to log parameters, code, and results in machine learning experiments 
* HuoguoML Dashboard: A dashboard that displays experiments and their associated artifacts
* HuoguoML Service: A CLI to easily launch a machine learning microservice from your logged experiments

HuoguoML can be installed via PyPI. Install the stable version of HuoguoML via PyPI:

```bash
pip install huoguoml
```

or the development version, which is updated with every commit on the main branch:

```bash
pip install huoguoml-dev
```

## Use Cases

When dealing with Machine Learning applications, there is a high management and coordination effort for data scientists, as they have to collaborately analyze, evaluate and update many different models with different metadata on a regular basis. HuoguoML aims to simplify the management process by providing ready-made tools that are used by data scientists. 

**Individual Data Scientists** can use HuoguoML to track experiments locally on their machine and output models that ML engineers can then deploy using HuoguoML’s deployment tools. 

**Data Science Teams** can use a HuoguoML tracking server to log and compare the results of multiple data scientist working on the same or a different problem. By setting up a convention for naming their parameters and metrics, they can try different algorithms to address the same problem and then run the same algorithms again on new data to compare models in the future. In addition, anyone can download and run a different model.

**ML Engineers** can deploy models from different ML libraries in the same way by executing a simple command. Furthermore, all services are centrally maintained and support OTA updates.



