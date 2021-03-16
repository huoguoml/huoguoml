/* --- STATE --- */
import { ServiceInterface } from '../../../../types';
import { PageState } from '../../../../types/RootState';

export interface ServicesPageState extends PageState {
  services?: ServiceInterface[];
}
