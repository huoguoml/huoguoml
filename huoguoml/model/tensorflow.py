import os
import shutil
from datetime import datetime
from typing import List

import yaml


def get_requirements() -> List[str]:
    """
    Returns a list of requirements that are required for a Tensorflow model.
    """
    import tensorflow as tf
    import huoguoml
    return ["tensorflow={}".format(tf.__version__),
            "huoguoml={}".format(huoguoml.__version__)]


def _load_saved_model(tf_saved_model_dir: str, tf_meta_graph_tags: str, tf_signature_def_key: str):
    import tensorflow as tf

    model = tf.saved_model.load(
        tags=tf_meta_graph_tags, export_dir=tf_saved_model_dir
    )
    signatures = model.signatures

    if tf_signature_def_key not in signatures:
        raise KeyError(
            "Could not find signature def key %s. Available keys are: %s"
            % (tf_signature_def_key, list(signatures.keys()))
        )
    return signatures[tf_signature_def_key]


def log_model(
        tf_saved_model_dir: str,
        tf_meta_graph_tags: str,
        tf_signature_def_key: str,
        artifact_dir: str,
):
    import tensorflow as tf
    if tf.__version__ < "2.0.0":
        raise NotImplementedError("HuoguoML does not support Tensorflow 1.X")

    # TODO: replace print with logger.info()
    print(
        "Validating the specified TensorFlow model by attempting to load it in a new TensorFlow"
        " graph..."
    )
    saved_model = _load_saved_model(
        tf_saved_model_dir=tf_saved_model_dir,
        tf_meta_graph_tags=tf_meta_graph_tags,
        tf_signature_def_key=tf_signature_def_key,
    )
    print("Validation succeeded!")

    # copy model
    model_dir = os.path.join(artifact_dir, "model")
    shutil.copytree(tf_saved_model_dir, model_dir)

    # requirements.txt
    requirements_path = os.path.join(artifact_dir, "requirements.txt")
    with open(requirements_path, "w+") as file:
        file.writelines(get_requirements())

    signature = {"inputs": {},
                 "outputs": {}}
    for input_tensor in saved_model.structured_input_signature:
        if input_tensor:
            for tensor_name, tensor_spec in input_tensor.items():
                signature["inputs"][tensor_name] = [tensor_spec.shape.as_list,
                                                    tensor_spec.dtype.name]
    for tensor_name, tensor_spec in saved_model.structured_outputs.items():
        signature["outputs"][tensor_name] = [tensor_spec.shape, tensor_spec.dtype]

    # TODO: create seperate class for logging config.yaml
    config = {"requirements_path": requirements_path,
              "model": {
                  "module": "tensorflow",
                  load_model.__name__: {
                      "tf_saved_model_dir": model_dir,
                      "tf_meta_graph_tags": tf_meta_graph_tags,
                      "tf_signature_def_key": tf_signature_def_key,
                  }
              },
              "time_created": str(datetime.utcnow()),
              "id": "1",
              "signature": signature
              }
    config_path = os.path.join(artifact_dir, "config.yaml")
    with open(config_path, 'w+') as file:
        yaml.dump(config, file, default_flow_style=False)


# TODO: Refactor code, Update TFModel
def load_model(tf_saved_model_dir: str, tf_meta_graph_tags: str, tf_signature_def_key: str):
    saved_model = _load_saved_model(tf_saved_model_dir=tf_saved_model_dir,
                                    tf_meta_graph_tags=tf_meta_graph_tags,
                                    tf_signature_def_key=tf_signature_def_key)
    return _TF2Model(saved_model=saved_model)


class _TF2Model(object):

    def __init__(self, saved_model):
        self.saved_model = saved_model

    def predict(self, data):
        import tensorflow as tf

        data_ten = tf.constant(data)
        pred = self.saved_model(data_ten)
        pred_dict = {col_name: pred[col_name].numpy().tolist() for col_name in pred.keys()}
        return pred_dict
