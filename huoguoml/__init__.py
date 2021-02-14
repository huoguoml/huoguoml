"""
The huoguoml package provides a easy way for managing Machine Learning types and
services
"""
__license__ = 'Apache-2.0'
__version__ = '0.1'

import huoguoml.tracking.tensorflow as tensorflow
from huoguoml.tracking import create_experiment

experiment = None
experiment_dir = None
