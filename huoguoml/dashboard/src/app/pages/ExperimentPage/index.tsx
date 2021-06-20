import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/tables/RunTable/Loadable';
import { ContentCardsLayout } from '../../layout/ContentCardsLayout/Loadable';
import { Alert, Button, Descriptions, message, Space, Typography } from 'antd';
import { RunInterface } from '../../../types';

import { MarkdownEditor } from '../../components/MarkdownEditor/Loadable';
import axios from 'axios';
import { EXPERIMENT_URI } from '../../../constants';
import { timestampToDate } from '../../../utils/time'; // `rehype-katex` does not import the CSS for you

export function ExperimentPage() {
  const { Title } = Typography;

  const { experimentName } = useParams<Record<string, string>>();

  const dispatch = useDispatch();
  const { actions } = useExperimentPageSlice();

  const experimentPageState = useSelector(selectExperimentPage);

  React.useEffect(() => {
    dispatch(actions.getExperimentState(experimentName));
  }, [dispatch, experimentName, actions]);

  let history = useHistory();

  const [selectedRows, setSelectedRows] = React.useState<RunInterface[]>([]);

  function toRunPage(runNr: number) {
    history.push(`/experiments/${experimentName}/${runNr}`);
  }

  function toComparePage(runIds: number[]) {
    history.push(`/experiments/${experimentName}/compare/${runIds}`);
  }

  function updateDescription(description: string) {
    axios
      .put(`${EXPERIMENT_URI}/${experimentName}`, {
        ...experimentPageState.experiment,
        description: description,
      })
      .then(response => {
        message.success(`Updated description`);
      })
      .catch(error => {
        message.error(error.message);
      });
  }

  return (
    <>
      <ContentCardsLayout
        contentUri={['experiments', experimentName]}
        skipUri={['experiments']}
      >
        <>
          <Title level={1}>Experiment: {experimentName}</Title>
          <Descriptions>
            <Descriptions.Item
              label="Created at"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {timestampToDate(
                experimentPageState.experiment?.runs[0].creation_time,
              )}
            </Descriptions.Item>
            <Descriptions.Item
              label="Last modification at"
              labelStyle={{ fontWeight: 'bold' }}
            >
              {timestampToDate(
                experimentPageState.experiment?.runs[
                  experimentPageState.experiment?.runs.length - 1
                ].creation_time,
              )}
            </Descriptions.Item>
          </Descriptions>
        </>
        <>
          <MarkdownEditor
            value={experimentPageState.experiment?.description || ''}
            placeholder={
              'Add a description to your experiment in markdown format'
            }
            onSubmit={updateDescription}
          />
        </>
        <>
          <Title level={2}>Available runs</Title>
          {selectedRows.length > 0 && (
            <Alert
              style={{ marginBottom: 12 }}
              showIcon
              message={`Selected ${selectedRows.length} runs`}
              type="info"
              action={
                <>
                  <Space>
                    <Button
                      type="primary"
                      disabled={selectedRows.length <= 1}
                      onClick={() =>
                        toComparePage(selectedRows.map(row => row.run_nr))
                      }
                    >
                      Compare
                    </Button>
                    <Button
                      disabled={selectedRows.length < 1}
                      onClick={() => setSelectedRows([])}
                    >
                      Clear
                    </Button>
                  </Space>
                </>
              }
            />
          )}
          <RunTable
            runs={experimentPageState.experiment?.runs}
            selectedRuns={selectedRows}
            setSelectedRuns={setSelectedRows}
            onClick={toRunPage}
            isLoading={experimentPageState.isLoading}
          />
        </>
      </ContentCardsLayout>
    </>
  );
}
