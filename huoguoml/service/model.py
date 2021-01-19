class Model(object):

    def __init__(self):
        self.hallo = "hallo"

    def predict(self, data):
        """
        Gets the payload of the request and creates a prediction

        :param data: payload of the request as dict
        :return: prediction on data
        """
        # model.predict
