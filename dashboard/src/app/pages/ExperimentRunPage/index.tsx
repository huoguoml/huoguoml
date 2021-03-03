import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useExperimentRunPageSlice } from './slice';
import { selectExperimentRunPage } from './slice/selectors';
import { Card, Col, Row, Typography } from 'antd';
import { RecordTable } from '../../components/RecordTable/Loadable';
import { RecordTags } from '../../components/RecordTags/Loadable';

export function ExperimentRunPage() {
  const { runId, experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentRunPageSlice();
  const experimentRunPageState = useSelector(selectExperimentRunPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentRunState(`/${experimentName}/${runId}`));
  }, [dispatch, runId, actions]);

  const { Title, Paragraph } = Typography;
  return (
    <>
      <Card style={{ width: '100%' }}>
        <Title level={3}>
          Experiment: {experimentRunPageState.run?.experiment_name}
        </Title>
        <Title level={3}>
          Created: {experimentRunPageState.run?.creation_time}
        </Title>
        <Title level={3}>Id: {experimentRunPageState.run?.id}</Title>
        <Paragraph editable={true}>
          In the process of internal desktop applications development, many
          different design specs and implementations would be involved, which
          might cause designers and developers difficulties and duplication and
          reduce the efficiency of development.
        </Paragraph>
        <RecordTags title={'Tags'} record={experimentRunPageState.run?.tags} />
      </Card>

      <Row gutter={[8, 8]}>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <RecordTable
            title={'Parameters'}
            record={experimentRunPageState.run?.parameters}
          />
        </Col>
        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <RecordTable
            title={'Metrics'}
            record={experimentRunPageState.run?.metrics}
          />
        </Col>
      </Row>
    </>
  );
}
