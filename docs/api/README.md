<a name="huoguoml"></a>
# huoguoml

The huoguoml package provides a easy way for managing Machine Learning types and
services

<a name="huoguoml.cli"></a>
# huoguoml.cli

The huoguoml.cli module contains code for the HuoguoML CLI

<a name="huoguoml.cli.cli"></a>
#### cli

```python
@click.group()
@click.version_option()
cli()
```

The HuoguoML CLI. Start the HuoguoML tracking server with 'huoguoml server' or
a service with 'huoguoml service'

<a name="huoguoml.cli.server"></a>
#### server

```python
@cli.command()
@click.option(
    "--host",
    default="127.0.0.1",
    help="The network address to listen on (default: 127.0.0.1).",
)
@click.option(
    "--port",
    default=8080,
    help="The port to listen on (default: 8080).",
)
@click.option(
    "--artifact_dir",
    default=HUOGUOML_DEFAULT_SERVER_FOLDER,
    help="The location of the artifact directory for the HuoguoML server (default: {}).".format(
        HUOGUOML_DEFAULT_SERVER_FOLDER),
)
server(host: str, port: int, artifact_dir: str)
```

Run the HuoguoML tracking server.
The server listens on http://127.0.0.1:5000 by default, and only
accept connections from the local machine. To let the server accept
connections from other machines, you will need to pass `--host 0.0.0.0`
to listen on all network interfaces (or a specific interface address).

<a name="huoguoml.cli.service"></a>
#### service

```python
@cli.command()
@click.option(
    "--host",
    default=HUOGUOML_DEFAULT_SERVICE_HOST,
    help="The network address to listen on (default: {}).".format(HUOGUOML_DEFAULT_SERVICE_HOST),
)
@click.option(
    "--port",
    default=HUOGUOML_DEFAULT_SERVICE_PORT,
    help="The port to listen on (default: {}).".format(HUOGUOML_DEFAULT_SERVICE_PORT),
)
@click.option(
    "--run_uri",
    help="The uri to the run files",
)
@click.option(
    "--artifact_dir",
    default=HUOGUOML_DEFAULT_SERVICE_FOLDER,
    help="The location of the artifact directory for the HuoguoML service (default: {}).".format(
        HUOGUOML_DEFAULT_SERVICE_FOLDER),
)
service(host: str, port: int, run_uri: str, artifact_dir: str)
```

Run a HuoguoML service.
The service listens on http://127.0.0.1:8080 by default, and only
accept connections from the local machine. To let the server accept
request from other machines, you will need to pass `--host 0.0.0.0`
to listen on all network interfaces (or a specific interface address).

<a name="huoguoml.constants"></a>
# huoguoml.constants

The huoguoml.constants module contains used throughout the whole package

<a name="huoguoml.logger"></a>
# huoguoml.logger

The huoguoml.logger module contains the logger that is used throughout the whole package

<a name="huoguoml.schemas"></a>
# huoguoml.schemas

The huoguoml.types module contains all types used throughout the package

<a name="huoguoml.schemas.ModelNode"></a>
## ModelNode Objects

```python
class ModelNode(BaseModel)
```

Model Node

<a name="huoguoml.schemas.ModelGraph"></a>
## ModelGraph Objects

```python
class ModelGraph(BaseModel)
```

Type for a model. Every model consists of a input/output
node with a certain shape and dtype.

<a name="huoguoml.schemas.ModelAPI"></a>
## ModelAPI Objects

```python
class ModelAPI(BaseModel)
```

Type for the model tracking API.

<a name="huoguoml.schemas.ModelDefinition"></a>
## ModelDefinition Objects

```python
class ModelDefinition(BaseModel)
```

Type for the definition of a model

<a name="huoguoml.schemas.Run"></a>
## Run Objects

```python
class Run(BaseModel)
```

Type for a single experiment Run

<a name="huoguoml.schemas.Experiment"></a>
## Experiment Objects

```python
class Experiment(BaseModel)
```

Type for a experiment

<a name="huoguoml.server"></a>
# huoguoml.server

<a name="huoguoml.server.database"></a>
# huoguoml.server.database

<a name="huoguoml.server.database.models"></a>
# huoguoml.server.database.models

The huoguoml.models module contains the model definition for our ORM mapper SQL Alchemy

<a name="huoguoml.server.database.repository"></a>
# huoguoml.server.database.repository

The huoguoml.database module provides the database that contains all informations

<a name="huoguoml.server.database.repository.Repository"></a>
## Repository Objects

```python
class Repository(object)
```

The Repository object is responsible for the connection to the database.

<a name="huoguoml.server.database.service"></a>
# huoguoml.server.database.service

The huoguoml.database module provides the database that contains all informations

<a name="huoguoml.server.database.service.Service"></a>
## Service Objects

```python
class Service(object)
```

The Repository object is responsible for the connection to the database.

<a name="huoguoml.server.dependencies"></a>
# huoguoml.server.dependencies

<a name="huoguoml.server.main"></a>
# huoguoml.server.main

<a name="huoguoml.server.main.start_huoguoml_server"></a>
#### start\_huoguoml\_server

```python
start_huoguoml_server(artifact_dir: str, host: str, port: int)
```

Starts the HuoguoML server

**Arguments**:

- `artifact_dir` - Location of the artifact directory
- `host` - The network address to listen on
- `port` - The port to listen on

<a name="huoguoml.server.routers"></a>
# huoguoml.server.routers

<a name="huoguoml.server.routers.experiment"></a>
# huoguoml.server.routers.experiment

<a name="huoguoml.server.routers.run"></a>
# huoguoml.server.routers.run

<a name="huoguoml.service"></a>
# huoguoml.service

<a name="huoguoml.service.main"></a>
# huoguoml.service.main

<a name="huoguoml.service.main.start_huoguoml_service"></a>
#### start\_huoguoml\_service

```python
start_huoguoml_service(host: str, port: int, run_uri: str, artifact_dir: str)
```

Starts the HuoguoML service

**Arguments**:

- `host` - The network address to listen on
- `port` - The port to listen on
- `run_uri` - URI to the run artifact
- `artifact_dir` - Location of the artifact directory

<a name="huoguoml.tracking"></a>
# huoguoml.tracking

The huoguoml.tracking module provides the options for tracking all experiment runs

<a name="huoguoml.tracking.start_experiment_run"></a>
#### start\_experiment\_run

```python
start_experiment_run(experiment_name: Optional[str] = None, run_id: Optional[int] = None, huoguoml_dir: str = "./huoguoml")
```

Start a HuoguoML experiments run. If the experiment does not exist a new one will be created.

**Arguments**:

  run_id:
- `experiment_name` - name of the experiment
- `huoguoml_dir` - location of the HuoguoML directory. (default: ./huoguoml)

<a name="huoguoml.tracking.tensorflow"></a>
# huoguoml.tracking.tensorflow

The huoguoml.tracking module provides the options for tracking tensorflow experiments

<a name="huoguoml.tracking.tensorflow.get_requirements"></a>
#### get\_requirements

```python
get_requirements() -> List[str]
```

Returns a list of requirements that are required for a Tensorflow tracking.

<a name="huoguoml.tracking.tensorflow.TFModel"></a>
## TFModel Objects

```python
class TFModel(object)
```

TFModel used for predictions

<a name="huoguoml.utils"></a>
# huoguoml.utils

The huoguoml.utils module contains some utility functions used throughout the whole package

<a name="huoguoml.utils.read_json"></a>
#### read\_json

```python
read_json(json_path: str) -> Optional[Any]
```

Read a json file and return the content. Returns None if not exist

<a name="huoguoml.utils.save_json"></a>
#### save\_json

```python
save_json(json_path: str, data: Any)
```

Save data as json format

<a name="huoguoml.utils.create_hash"></a>
#### create\_hash

```python
create_hash(value: str, algorithm: str) -> str
```

Returns the hash value for a given string value with the given algorithm.
Supported hash algorithms can be seen with following lines of code:

    import hashlib
    print(hashlib.algorithms_available)

<a name="huoguoml.utils.create_huoguoml_folders"></a>
#### create\_huoguoml\_folders

```python
create_huoguoml_folders(huoguoml_path: str)
```

Create HuoguoML folders if not exist

**Arguments**:

- `huoguoml_path` - path to the huoguoml dir
  
- `NOTE` - Required for later stages, when huoguoml folder gets larger

<a name="huoguoml.utils.create_zip_file"></a>
#### create\_zip\_file

```python
create_zip_file(src_dir: str, dst_dir: str, zip_name: str) -> str
```

Creates a zip file out of a whole directory and saves it under a given name at a given directory

**Arguments**:

- `src_dir` - source directory
- `dst_dir` - destination directory
- `zip_name` - name of the output zip
  

**Returns**:

- `zip_file_path` - path to the zip file

<a name="huoguoml.utils.download_and_extract_run_files"></a>
#### download\_and\_extract\_run\_files

```python
download_and_extract_run_files(run_uri: str, dst_dir: str)
```

Gets a URI to a ZIP file, downloads it and extract it to a specific folder.



