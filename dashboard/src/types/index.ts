import { RootState } from './RootState';

export interface ModelAPIInterface {
  module: string;
  name: string;
  arguments: { string: any };
}

export interface ModelNodeInterface {
  dtype: string;
  shape: (null | number)[];
}

export interface ModelDefinitionInterface {
  inputs: { string: ModelNodeInterface };
  outputs: { string: ModelNodeInterface };
}

export interface RunInterface {
  id: number;
  run_nr: number;
  creation_time: number;
  experiment_name: string;
  model_definition?: ModelDefinitionInterface;
  model_api?: ModelAPIInterface;
  requirements?: string[];
}

export interface ExperimentInterface {
  id: number;
  name: string;
  runs: RunInterface[];
}

export type { RootState };
