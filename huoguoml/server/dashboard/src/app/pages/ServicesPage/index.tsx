import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useServicesPageSlice } from './slice';
import { selectServicesPageState } from './slice/selectors';
import { ServiceTable } from '../../components/Table/ServiceTable/Loadable';
import { Typography } from 'antd';

export function ServicesPage() {
  const dispatch = useDispatch();
  const { actions } = useServicesPageSlice();
  const servicesPageState = useSelector(selectServicesPageState);

  React.useEffect(() => {
    dispatch(actions.getServicesState());
  }, [dispatch]);

  const { Title } = Typography;

  return (
    <>
      <ContentCardLayout contentUri={['services']}>
        <Title level={2}>Services</Title>
        <ServiceTable services={servicesPageState.services} />
      </ContentCardLayout>
    </>
  );
}
