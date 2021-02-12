def start_experiment(experiment_name, huoguoml_dir):
    raise NotImplementedError


class Experiment(object):

    def __init__(self, name, creation_date, huoguoml_dir):
        self.creation_date = creation_date
        self.name = name

        # load huoguomldir content
        self.experiments = []
