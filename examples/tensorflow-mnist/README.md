# MNIST Classifier with Tensorflow and HuoguoML

This example shows how to use HuoguoML to track your experiment metadata using the example of creating an MNIST
classifier.

## Requirements

```bash
pip install -r requirements.txt
```

## Track your machine learning experiment

### Local

Start the training script with different parameters:

```bash
python train-local.py --help
python train-local.py
```

Afterward you can launch a HuoguoML tracking server on `127.0.0.1:8080` to see your results:

```bash
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir .
```

### Remote Server

Start a HuoguoML tracking server on `127.0.0.1:8080` and set the artifact directory to the current directory:

```bash
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir .
```

Start the training script with different parameters:

```bash
python train-server.py --help
python train-server.py
```

Go to `127.0.0.1:8080/experiments/mnist` and see your results.

## Create a model registry

After experimenting for a while, you decide to use a model. To do this, you select an experiment run and register it
under a name. Then the model file can be downloaded via HTTP GET requests e.g:

```bash
curl -X 'GET' \
  'http://127.0.0.1:8080/api/models/mnist/v1' \
  -H 'accept: application/zip' \
  --output model_files.zip
```

## Create a serving CLI

In order to create a serving client run following command:

```bash
huoguoml serving --host=127.0.0.1 \
                 --port=5000 \
                 --server_uri=127.0.0.1:8080\
                 --model_name=mnist\
                 --model_rule=latest
```

`example-requests.py` script shows how to reach the endpoints. Alternatively, you can visit the API documentation
at `localhost:8080/docs`