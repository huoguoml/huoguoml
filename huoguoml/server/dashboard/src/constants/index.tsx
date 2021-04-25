export const BACKEND_API: string = process.env
  .REACT_APP_HUOGUOML_SERVER_BACKEND_API
  ? process.env.REACT_APP_HUOGUOML_SERVER_BACKEND_API
  : 'http://localhost:8080';

export const EXPERIMENT_URI: string = BACKEND_API + '/api/v1/experiments';
export const ML_SERVICE_URI: string = BACKEND_API + '/api/v1/ml_services';
export const ML_MODEL_URI: string = BACKEND_API + '/api/v1/ml_models';
export const RUN_URI: string = BACKEND_API + '/api/v1/runs';
