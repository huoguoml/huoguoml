# QuickStart

Easy-peasy steps to do :)

```
pip install huoguoml
```

```
with huoguoml.start_experiment_run("mnist", "./huoguoml") as run:
    run.log_parameter("test", 1123123)
    run.log_metric("test", 1123123)
    run.log_model("tensorflow", tf_saved_model_dir="./model", 
                              tf_meta_graph_tags="serve",
                              tf_signature_def_key="serving_default")
```