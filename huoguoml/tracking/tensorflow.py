"""
The huoguoml.tracking module provides the options for tracking tensorflow experiments
"""
import os
from typing import List, Tuple

from huoguoml.constants import HUOGUOML_DEFAULT_REQUIREMENTS, HUOGUOML_DEFAULT_MODEL_FOLDER
from huoguoml.schema.run import ModelNode, ModelDefinition, ModelAPI, ModelGraph


def get_requirements() -> List[str]:
    """
    Returns a list of requirements that are required for a Tensorflow tracking.
    """
    import tensorflow as tf

    requirements = HUOGUOML_DEFAULT_REQUIREMENTS.copy()
    requirements.append("tensorflow=={}".format(tf.__version__))
    return requirements


def get_file_pattern() -> List[str]:
    """
    Returns a list with all possible file patterns
    """
    return ["*.pb", "*.data", "*.index"]


def _load_saved_model(tf_saved_model_dir: str, tf_meta_graph_tags: str, tf_signature_def_key: str):
    """
    Loads a TF SavedModel
    """
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
        tf_signature_def_key: str) -> Tuple[ModelDefinition, List]:
    import tensorflow as tf
    if tf.__version__ < "2.0.0":
        raise NotImplementedError("HuoguoML does not support Tensorflow 1.X")

    # check if saved model is valid
    saved_model = _load_saved_model(
        tf_saved_model_dir=tf_saved_model_dir,
        tf_meta_graph_tags=tf_meta_graph_tags,
        tf_signature_def_key=tf_signature_def_key,
    )
    requirements = get_requirements()
    inputs = {}
    for input_tensor in saved_model.structured_input_signature:
        if input_tensor:
            for tensor_name, tensor_spec in input_tensor.items():
                inputs[tensor_name] = ModelNode(shape=tensor_spec.shape.as_list(),
                                                dtype=tensor_spec.dtype.name)
    outputs = {}
    for tensor_name, tensor_spec in saved_model.structured_outputs.items():
        outputs[tensor_name] = ModelNode(shape=tensor_spec.shape.as_list(),
                                         dtype=tensor_spec.dtype.name)
    model_graph = ModelGraph(inputs=inputs, outputs=outputs)

    model_api = ModelAPI(module="tensorflow",
                         arguments={
                             "tf_saved_model_dir": HUOGUOML_DEFAULT_MODEL_FOLDER,
                             "tf_meta_graph_tags": tf_meta_graph_tags,
                             "tf_signature_def_key": tf_signature_def_key,
                         },
                         name="load_model")

    model_files = []
    for dir_path, _, filenames in os.walk(tf_saved_model_dir):
        for filename in filenames:
            file_path = os.path.join(dir_path, filename)
            abs_file_path = os.path.abspath(file_path)
            model_file_path = os.path.relpath(file_path, tf_saved_model_dir)
            model_file = ("files", (model_file_path, open(abs_file_path, "rb")))
            model_files.append(model_file)
    model_definition = ModelDefinition(model_api=model_api,
                                       model_graph=model_graph,
                                       requirements=requirements)
    return model_definition, model_files


def load_model(tf_saved_model_dir: str, tf_meta_graph_tags: str, tf_signature_def_key: str):
    saved_model = _load_saved_model(tf_saved_model_dir=tf_saved_model_dir,
                                    tf_meta_graph_tags=tf_meta_graph_tags,
                                    tf_signature_def_key=tf_signature_def_key)
    return TFModel(saved_model=saved_model)


class TFModel(object):
    """
    TFModel used for predictions
    """

    def __init__(self, saved_model):
        self.saved_model = saved_model

    def predict(self, data):
        import tensorflow as tf

        data_dict = data.dict()
        for key in data_dict.keys():
            data_dict[key] = tf.constant(data_dict[key])

        pred = self.saved_model(**data_dict)
        pred_dict = {col_name: pred[col_name].numpy().tolist() for col_name in pred.keys()}
        return pred_dict
