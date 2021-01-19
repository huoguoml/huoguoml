import os

from setuptools import find_packages
from setuptools import setup


def get_extra_requires(path, add_all=True):
    import re
    from collections import defaultdict

    with open(path) as fp:
        extra_deps = defaultdict(set)
        for k in fp:
            if k.strip() and not k.startswith('#'):
                tags = set()
                if ':' in k:
                    k, v = k.split(':')
                    tags.update(vv.strip() for vv in v.split(','))
                tags.add(re.split('[<=>]', k)[0])
                for t in tags:
                    extra_deps[t].add(k)

        # add tag `all` at the end
        if add_all:
            extra_deps['all'] = set(vv for v in extra_deps.values() for vv in v)
    return extra_deps


# get all packages in requirements file
dependencies = get_extra_requires('extra-requirements.txt')

# get key package details from py_pkg/__version__.py
about = {}  # type: ignore
here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'huoguoml', '__init__.py')) as f:
    exec(f.read(), about)

# load the README file and use it as the long_description for PyPI
with open('README.md', 'r') as f:
    readme = f.read()


def package_files(directory):
    paths = []
    for (path, _, filenames) in os.walk(directory):
        for filename in filenames:
            paths.append(os.path.join("..", path, filename))
    return paths


js_files = package_files("huoguoml/dashboard")

# package configuration - for reference see:
# https://setuptools.readthedocs.io/en/latest/setuptools.html#id9
setup(
    name="HuoguoML",
    description="A platform for managing and serving Machine Learning models.",
    long_description=readme,
    long_description_content_type='text/markdown',
    version=about['__version__'],
    author="Steven Mi",
    url="huoguoml.github.io",
    packages=find_packages(exclude=["tests"]),
    include_package_data=True,
    package_data={'huoguoml': js_files},
    python_requires=">=3.7.*",
    install_requires=list(dependencies['all']),
    license=about['__license__'],
    zip_safe=False,
    entry_points="""
        [console_scripts]
        huoguoml=huoguoml.cli:cli
    """,
    classifiers=[
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'Intended Audience :: Education',
        'Intended Audience :: Science/Research',
        'Programming Language :: Python :: 3.7',
        'Programming Language :: Python :: 3.8',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Unix Shell',
        'Environment :: Console',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Topic :: Database :: Database Engines/Servers',
        'Topic :: Scientific/Engineering :: Artificial Intelligence',
        'Topic :: Software Development',
        'Topic :: Software Development :: Libraries',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
    keywords='huoguo machine learning deployment serving models management'
)
