# MNIST Classifier with Tensorflow and HuoguoML

## Requirements

```bash
pip install -r requirements.txt
```

## Getting Started

Start a HuoguoML tracking server on `127.0.0.1:8080` and set the artifact directory to the current directory:

```
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir .
```

Start the training script with different parameters:

```
python train.py
```

Go to `127.0.0.1:8080/experiments/mnist` and see your results. Now you can create a registry and create a REST service with HuoguoML Serving.
