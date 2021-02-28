import { RootState } from './RootState';

export interface ModelAPIInterface {
  module: string;
  name: string;
  arguments: { string: any };
}

export interface ModelNodeInterface {
  dtype: string;
  shape: (undefined | number)[];
}

export interface ModelGraphInterface {
  inputs: { string: ModelNodeInterface };
  outputs: { string: ModelNodeInterface };
}

export interface ModelDefinitionInterface {
  model_graph: ModelGraphInterface;
  model_api: ModelAPIInterface;
  requirements: string[];
}

export interface RunInterface {
  id: number;
  run_nr: number;
  creation_time: number;
  experiment_name: string;
  model_definition?: ModelDefinitionInterface;
  parameters?: { string: string };
  metrics?: { string: string };
  tags?: { string: string };
}

export interface ExperimentInterface {
  id: number;
  name: string;
  runs: RunInterface[];
}

export type { RootState };
