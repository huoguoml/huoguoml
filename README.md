> **Note:** HuoguoML is stil under development and can have some unknown issues.
>
<div align="center">
<h1>🍲 HuoguoML</h1>
</div>

When dealing with Machine Learning applications, there is a high management and coordination effort for data scientists,
as they have to collaborately analyze, evaluate and update many different models with different metadata on a regular
basis. **HuoguoML** aims to simplify the management process by providing a platform for managing and serving machine
learning models. It enables:

- **Individual Data Scientists** to track experiments locally on their machine and output models to ML engineers, who
  then deploy them using HuoguoML's deployment tools.
- **Data Science Teams** to set up a HuoguoML tracking server to log and compare the results of multiple data scientists
  working on the same or a different problem. Then, by setting up a convention for naming their parameters and metrics,
  they can try different algorithms to solve the same problem and then run the same algorithms again on new data to
  compare models in the future. In addition, anyone can download and run a different model.
- **ML Engineers** to deploy models from different ML libraries in the same way by executing a simple command. Each
  service is centrally maintained and supports OTA updates. On its own, a HuoguoML Service is based on FastAPI and can
  be extended with standard FastAPI tools. It supports all use cases, be it storing predictions with middleware or
  adding new endpoints e.g. for Prometheus.

## Installation

HuoguoML can be installed via PyPI. Install the stable version of HuoguoML via PyPI:

```bash
pip install huoguoml
```

or get the development version, which is updated with every commit on the main branch:

```bash
pip install huoguoml-dev
```

## Examples

Just starting out? Try out our examples which work out of the box:

| Example                          | Description   | 
| --------------------------       | -------------| 
| [Tensorflow MNIST](examples/tensorflow-mnist)    | Building a MNIST classifier with Tensorflow and HuoguoML | 

## Documentation

Apart from learning from the examples, we highly recommended you go through
our [documentation](https://steven-mi.gitbook.io/huoguoml/), as it gives you a more detailed guide to HuoguoML

Our docs are built on every push to the main or docs branch.

## Contributing

We encourage you to contribute to HuoguoML! Please check out the [Contributing guide](CONTRIBUTING.md) for guidelines
about how to proceed.

## License

Apache License Version 2.0, see [LICENSE](LICENSE)
