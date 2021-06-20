import * as React from 'react';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { useDispatch, useSelector } from 'react-redux';
import { useServicesPageSlice } from './slice';
import { selectServicesPageState } from './slice/selectors';
import { ServiceTable } from '../../components/tables/ServiceTable/Loadable';
import { Typography } from 'antd';
import { useHistory } from 'react-router-dom';

export function ServicesPage() {
  const dispatch = useDispatch();
  const { actions } = useServicesPageSlice();
  const servicesPageState = useSelector(selectServicesPageState);

  React.useEffect(() => {
    dispatch(actions.getServicesState());
  }, [dispatch, actions]);

  const { Title } = Typography;
  let history = useHistory();
  function toPage(uri: string) {
    history.push(uri);
  }
  return (
    <>
      <ContentCardsLayout contentUri={['services']}>
        <Title level={1}>Services</Title>
        <>
          <Title level={2}>Available Services</Title>
          <ServiceTable
            services={servicesPageState.services}
            onClick={toPage}
          />
        </>
      </ContentCardsLayout>
    </>
  );
}
