import { RootState } from './RootState';

export interface ModelAPIInterface {
  module: string;
  name: string;
  arguments: Record<string, string>;
}

export interface ModelNodeInterface {
  dtype: string;
  shape: (undefined | number)[];
}

export interface ModelGraphInterface {
  inputs: Record<string, ModelNodeInterface>;
  outputs: Record<string, ModelNodeInterface>;
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
  finish_time: number;
  author: string;
  status: number;
  experiment_name: string;
  model_definition?: ModelDefinitionInterface;
  parameters?: Record<string, string>;
  metrics?: Record<string, string>;
  tags?: Record<string, string>;
  ml_model?: MLModelRegistryInterface;
}

export interface ExperimentInterface {
  id: number;
  name: string;
  description: string;
  runs: RunInterface[];
}

export interface ServiceInterface {
  id: number;
  host: string;
  port: string;
  model_rule: string;
}

export interface MLModelRegistryInterface {
  name: string;
  ml_models: MLModelInterface[];
}

export interface MLModelInterface {
  id: number;
  version: string;
  tag?: number;
}

export type { RootState };
