import * as React from 'react';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useServicesPageSlice } from './slice';
import { selectServicesPageState } from './slice/selectors';
import { ServiceTable } from '../../components/tables/ServiceTable/Loadable';
import { Typography } from 'antd';

export function ServicesPage() {
  const dispatch = useDispatch();
  const { actions } = useServicesPageSlice();
  const servicesPageState = useSelector(selectServicesPageState);

  React.useEffect(() => {
    dispatch(actions.getServicesState());
  }, [dispatch, actions]);

  const { Title } = Typography;

  return (
    <>
      <ContentCardLayout contentUri={['services']}>
        <Title level={2}>Services</Title>
        <Title level={3}>Available Services</Title>
        <ServiceTable services={servicesPageState.services} />
      </ContentCardLayout>
    </>
  );
}
