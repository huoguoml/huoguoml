# Welcome to HuoguoML!

## Introduction

When dealing with Machine Learning applications, there is a high management and coordination effort for data scientists, as they have to collaborately analyze, evaluate and update many different models with different metadata on a regular basis. **HuoguoML** aims to simplify the management process by providing a platform for managing and serving machine learning models. It enables:

* **Individual Data Scientists** to track experiments locally on their machine and output models to ML engineers, who then deploy them using HuoguoML's deployment tools.
* **Data Science Teams** can set up a HuoguoML tracking server to log and compare the results of multiple data scientists working on the same or a different problem. Then, by setting up a convention for naming their parameters and metrics, they can try different algorithms to solve the same problem and then run the same algorithms again on new data to compare models in the future. In addition, anyone can download and run a different model.
* **ML Engineers** can deploy models from different ML libraries in the same way by executing a simple command. Each service is centrally maintained and supports OTA updates. On its own, a HuoguoML Service is based on FastAPI and can be extended with standard FastAPI tools. It supports all use cases, be it storing predictions with middleware or adding new endpoints e.g. for Prometheus.

## Documentation overview

Each of the four Jina products has the following documentation types.

* **Introduction to HuoguoML**: New to a HuoguoML? Take a look at the introduction pages. They contain simple examples to get you started right away.
* **Deploy HuoguoML Server:** Guides for deploying a HuoguoML server to cloud providers.
* **Advanced HuoguoML:** More guides and examples for more advanced use cases.
* **Misc**: Contains some information about the project itself, e.g. FAQ, license, ....

## Installation

HuoguoML can be installed via PyPI. Install the stable version of HuoguoML via PyPI:

```bash
pip install huoguoml
```

or the development version, which is updated with every commit on the main branch:

```bash
pip install huoguoml-dev
```



