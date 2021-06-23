import click
import numpy as np
import requests
import tensorflow as tf

from huoguoml.util.string import concat_uri, coerce_url


def softmax(x):
    """Compute softmax values for each sets of scores in x."""
    return np.exp(x) / np.sum(np.exp(x), axis=0)


@click.command()
@click.option("--service_uri", default="127.0.0.1:5000",
              help="URI to the HuoguoML serving client (default: 127.0.0.1:5000)")
def main(service_uri: str):
    service_uri = coerce_url(service_uri)

    version = requests.get(concat_uri(service_uri, "api", "version"))
    print("VERSION:{}\n".format(version.json()))

    _, (x_test, y_test) = tf.keras.datasets.mnist.load_data()
    x_test = x_test / 255.0

    correct_predictions = 0
    for sample, label in zip(x_test, y_test):
        prediction = requests.post(concat_uri(service_uri, "api", "predict"), json={
            "flatten_input": sample.tolist()
        })
        prediction = np.array(prediction.json()["dense_1"])[0]
        predicted_class = np.argmax(softmax(prediction))

        if predicted_class == label:
            correct_predictions += 1
    print("TEST ACCURACY {}".format(correct_predictions / x_test.shape[0]))


if __name__ == "__main__":
    main()
