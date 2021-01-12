import os

from setuptools import find_packages
from setuptools import setup


def get_requirements(path):
    requirements = {}
    with open(path) as file:
        for line in file.readlines():
            if line.startswith("#"):
                continue

            pkg, tag = line.strip().replace(" ", "").split(':')
            requirements.get('all', []).append(pkg)
            requirements.get(tag, []).append(pkg)
    return requirements


# get all packages in requirements file
req = get_requirements('extra-requirements.txt')

# get key package details from py_pkg/__version__.py
about = {}  # type: ignore
here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'py_pkg', '__init__.py')) as f:
    exec(f.read(), about)

# load the README file and use it as the long_description for PyPI
with open('README.md', 'r') as f:
    readme = f.read()

# package configuration - for reference see:
# https://setuptools.readthedocs.io/en/latest/setuptools.html#id9
setup(
    name="HuoguoML",
    description="A platform for managing and serving Machine Learning models. The highlights are:",
    long_description=readme,
    long_description_content_type='text/markdown',
    version=about['__version__'],
    author="Steven Mi",
    url="huoguoml.github.io",
    packages=find_packages(),
    include_package_data=True,
    python_requires=">=3.7.*",
    install_requires=req['prod'],
    extras_require=req['all'],
    license=about['__license__'],
    zip_safe=False,
    entry_points={
        'console_scripts': ['py-package-template=py_pkg.entry_points:main'],
    },
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
    keywords='huoguo machine learning deployment serving model management'
)
