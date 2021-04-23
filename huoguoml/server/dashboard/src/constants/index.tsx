export const BACKEND_API: string = process.env
  .REACT_APP_HUOGUOML_SERVER_BACKEND_API
  ? process.env.REACT_APP_HUOGUOML_SERVER_BACKEND_API
  : 'http://localhost:8080';

export const EXPERIMENT_URI: string = BACKEND_API + '/api/v1/experiments';
export const SERVICE_URI: string = BACKEND_API + '/api/v1/services';
export const MODEL_URI: string = BACKEND_API + '/api/v1/models';
export const RUN_URI: string = BACKEND_API + '/api/v1/runs';
