export const BACKEND_API: string =
  window['HUOGUOML_API_URL'] !== '__HUOGUOML_API_URL__'
    ? window['HUOGUOML_API_URL']
    : 'http://localhost:8080';

export const EXPERIMENT_URI: string = BACKEND_API + '/api/experiments';
export const ML_SERVICE_URI: string = BACKEND_API + '/api/services';
export const ML_MODEL_URI: string = BACKEND_API + '/api/models';
export const RUN_URI: string = BACKEND_API + '/api/runs';
