# HuoguoML Tracking

## Introduction

As a data scientist, you work on machine learning problems. Most of the time you implement or modify different algorithms, train them with different parameters and select the best model. In the process, you store your results manually. To avoid this, use the **HuoguoML Tracking API,** which a Python API that allows you to save your metadata directly and easily. All metadata can be visualized on the **HuoguoML Dashboard**

## Tracking Server

First you have to start the HuoguoML tracking server. It must be running or you will not be able to save your metadata. The following command will start the server on `localhost:8080`:

```bash
huoguoml server --host 127.0.0.1 --port 8080 --artifact_dir=./
```

All files and logs will be saved in the current directory under the .huoguoml folder. In order to see, if it works, open your browser on `localhost:8080`. You should be able to see the HuoguoML dashboard.

**Note:** If you want to run the tracking server on cloud rescources, check the guides under **Deploy HuoguoML Server.**

## Track Parameters, Metrics and Tags

When the tracking server is running, you can use our Python API to run a HuoguoML experiment and log your parameters, metrics and tags. For this, you create a HuoguoML experiment run and use the built-in methods to log your parameters:

```python
import huoguoml
run = huoguoml.start_experiment_run("mnist-15", "127.0.0.1:8080")

run.log_parameter("batch_size", 32)
run.log_metric("accuracy", 92.75)
run.log_tag("framework", "tensorflow")

run.end_experiment_run()
```

Besides the possibility to initialize the run and terminate it manually, you can also use the experiment run as a content manager within a `with` block, see:

```python
import huoguoml
with huoguoml.start_experiment_run("mnist-15", "127.0.0.1:8080") as run
    run.log_parameter("batch_size", 32)
    run.log_metric("accuracy", 92.75)
    run.log_tag("framework", "tensorflow")
```

## Track Model Files

Besides tracking basic metadata, HuoguoML also supports tracking models from the most popular ML frameworks. A list of all supported ML frameworks can be seen below. Keep in mind that you can always ask for support of a new framework or implement it yourself. Implementing it is really simple and very manageable

### Tensorflow 2.X

**Note:** Tensorflow 1.X won't be supported



