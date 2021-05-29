export const BACKEND_API: string = process.env
  .REACT_APP_HUOGUOML_SERVER_BACKEND_API
  ? process.env.REACT_APP_HUOGUOML_SERVER_BACKEND_API
  : 'http://localhost:8080';

export const EXPERIMENT_URI: string = BACKEND_API + '/api/experiments';
export const ML_SERVICE_URI: string = BACKEND_API + '/api/services';
export const ML_MODEL_URI: string = BACKEND_API + '/api/models';
export const RUN_URI: string = BACKEND_API + '/api/runs';
