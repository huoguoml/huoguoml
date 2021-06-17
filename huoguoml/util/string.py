"""
The huoguoml.util.string module contains some utility functions for string operations.
"""


def create_hash(value: str, algorithm: str) -> str:
    """
    Returns the hash value for a given string value with the given algorithm.
    Supported hash algorithms can be seen with following lines of code:

        import hashlib
        print(hashlib.algorithms_available)
    """
    encoded_value = value.encode("utf-8")
    hash_object = hashlib.new(name=algorithm, data=encoded_value)
    hash_value = hash_object.hexdigest()
    return hash_value


def concat_uri(*args: str):
    return "/".join(args)


def coerce_url(url: str) -> str:
    """
    Gets a url as string and returns it in the right format

    Args:
        url: str

    Returns:
        formatted url as string
    """
    url = url.strip()
    if url.endswith("/"):
        url = url[:-1]

    for proto in ["http://", "https://"]:
        if url.startswith(proto):
            return url
    return "http://{0}".format(url)
