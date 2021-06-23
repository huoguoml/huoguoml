# MNIST Classifier with Tensorflow and HuoguoML

This example shows how to use HuoguoML to track your experiment metadata using the example of creating an MNIST classifier. You will also see how you can store the metadata locally on your PC or send the metadata to a HuoguoML tracking server.

## Requirements

```bash
pip install -r requirements.txt
```

## Getting Started - Local

Start the training script with different parameters:

```
python train-local.py
```

Start a HuoguoML tracking server on `127.0.0.1:8080` and set the artifact directory to the current directory:

```
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir .
```

Go to `127.0.0.1:8080/experiments/mnist` and see your results. Now you can create a registry and create a REST service with HuoguoML Serving.


## Getting Started - Server

Start a HuoguoML tracking server on `127.0.0.1:8080` and set the artifact directory to the current directory:

```
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir .
```

Start the training script with different parameters:

```
python train-server.py
```

Go to `127.0.0.1:8080/experiments/mnist` and see your results. Now you can create a registry and create a REST service with HuoguoML Serving.
