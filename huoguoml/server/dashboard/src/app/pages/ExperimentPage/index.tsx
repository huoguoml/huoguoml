import * as React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectExperimentPage } from './slice/selectors';
import { useExperimentPageSlice } from './slice';
import { RunTable } from '../../components/tables/RunTable/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { Alert, Button, Select, Typography } from 'antd';
import { RunInterface } from '../../../types';
import { DownloadOutlined, RedoOutlined } from '@ant-design/icons';

import 'katex/dist/katex.min.css';
import { MarkdownEditor } from '../../components/MarkdownEditor/Loadable'; // `rehype-katex` does not import the CSS for you

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

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function toRunPage(runNr: number) {
    history.push(`/experiments/${experimentName}/${runNr}`);
  }

  function toComparePage(runIds: number[]) {
    history.push(`/experiments/${experimentName}/compare?run_nrs=${runIds}`);
  }

  const [description, setDescription] = React.useState<string>('');

  return (
    <>
      <ContentCardLayout contentUri={['experiments', experimentName]}>
        <>
          <Title level={2}>Experiment: {experimentName}</Title>
        </>
        <>
          <Title level={3}>Description</Title>
          <MarkdownEditor
            value={description}
            onChange={setDescription}
            placeholder={
              'Add a description to your experiment in markdown format'
            }
          />
        </>
        <>
          <Title level={3}>Filter runs</Title>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            onChange={handleChange}
            tokenSeparators={[',']}
            placeholder={
              'Search runs by their value by typing the value or specifying a range'
            }
          />
        </>
        <>
          <Title level={3}>Available runs</Title>

          <Button icon={<DownloadOutlined />} />
          <Button icon={<RedoOutlined />} />
          <Alert
            message={`Selected ${selectedRows.length} runs`}
            type="info"
            action={
              <>
                <Button
                  type="primary"
                  disabled={selectedRows.length <= 1}
                  onClick={() =>
                    toComparePage(selectedRows.map(row => row.run_nr))
                  }
                >
                  Compare
                </Button>
                <Button disabled={selectedRows.length < 1}>Clear</Button>
                <Button disabled={selectedRows.length < 1}>Delete</Button>
              </>
            }
          />

          <RunTable
            runs={experimentPageState.experiment?.runs}
            selectedRuns={selectedRows}
            setSelectedRuns={setSelectedRows}
            onClick={toRunPage}
            isLoading={experimentPageState.isLoading}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
