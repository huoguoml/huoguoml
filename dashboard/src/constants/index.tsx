export const BACKEND_API: string = process.env
  .REACT_APP_HUOGUOML_SERVER_BACKEND_API
  ? process.env.REACT_APP_HUOGUOML_SERVER_BACKEND_API
  : 'http://localhost:8080/rest';

export const EXPERIMENT_URI: string = BACKEND_API + '/experiments';
export const RUN_URI: string = BACKEND_API + '/runs';
