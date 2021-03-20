export const BACKEND_API: string = process.env
  .REACT_APP_HUOGUOML_SERVER_BACKEND_API
  ? process.env.REACT_APP_HUOGUOML_SERVER_BACKEND_API
  : 'http://localhost:8080';

export const EXPERIMENT_URI: string = BACKEND_API + '/rest/experiments';
export const SERVICE_URI: string = BACKEND_API + '/rest/ml_services';
export const RUN_URI: string = BACKEND_API + '/rest/runs';
