import click
import tensorflow as tf

import huoguoml


@click.command()
@click.option("--artifact_dir", default=".",
              help="Path to the HouguoML artifact directory")
@click.option("--experiment_name", default="mnist", help="Name of the experiment (default: mnist)")
@click.option("--learning_rate", default=0.001, help="Learning rate (default: 0.001)")
@click.option("--batch_size", default=32, help="Batch size (default: 32)")
@click.option("--epochs", default=5, help="Epochs (default: 10)")
def main(artifact_dir: str, experiment_name: str, learning_rate: float, batch_size: int, epochs: int):
    with huoguoml.start_experiment_run(experiment_name, artifact_dir=artifact_dir) as run:
        print("START DATA FETCHING")
        (x_train, y_train), (x_test, y_test) = tf.keras.datasets.mnist.load_data()
        x_train, x_test = x_train / 255.0, x_test / 255.0

        print("START MODEL BUILDING")
        model = tf.keras.models.Sequential([
            tf.keras.layers.Flatten(input_shape=(28, 28)),
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dense(10)
        ])
        run.log_parameter("batch_size", batch_size)

        loss_fn = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
        run.log_parameter("loss", "SparseCategoricalCrossentropy")

        optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
        run.log_parameter("optimizers", "Adam")
        run.log_parameter("learning_rate", learning_rate)

        model.compile(optimizer=optimizer,
                      loss=loss_fn,
                      metrics=["accuracy"])

        print("START TRAINING")
        train_history = model.fit(x=x_train, y=y_train, epochs=epochs, batch_size=batch_size)
        run.log_metric("train_loss", train_history.history["loss"][-1])
        run.log_metric("train_accuracy", train_history.history["accuracy"][-1])

        print("START EVALUATION")
        test_loss, test_accuracy = model.evaluate(x_test, y_test)
        run.log_metric("test_loss", test_loss)
        run.log_metric("test_accuracy", test_accuracy)

        print("START EXPORTING")
        model.save("./model")
        run.log_model("tensorflow", tf_saved_model_dir="./model",
                      tf_meta_graph_tags="serve",
                      tf_signature_def_key="serving_default")


if __name__ == "__main__":
    main()
