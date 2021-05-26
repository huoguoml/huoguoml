import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectRunPage } from './slice/selectors';
import { useRunPageSlice } from './slice';
import { RunTable } from '../../components/Table/RunTable/Loadable';
import { ContentCardLayout } from '../../layout/ContentCardLayout/Loadable';
import { Alert, Button, Select, Typography } from 'antd';
import { RunInterface } from '../../../types';
import { DownloadOutlined, RedoOutlined } from '@ant-design/icons';

import 'katex/dist/katex.min.css';

export function RunPage() {
  const { Title } = Typography;

  const dispatch = useDispatch();
  const { actions } = useRunPageSlice();

  const runPageState = useSelector(selectRunPage);

  React.useEffect(() => {
    dispatch(actions.getRunState());
  }, [dispatch, actions]);

  let history = useHistory();

  const [selectedRows, setSelectedRows] = React.useState<RunInterface[]>([]);

  function handleChange(value) {
    console.log(`selected ${value}`);
  }

  function toRunPage(runId: number) {
    history.push(`/runs/${runId}`);
  }

  function toComparePage(runIds: number[]) {
    history.push(`/runs/compare?run_nrs=${runIds}`);
  }

  return (
    <>
      <ContentCardLayout contentUri={['runs']}>
        <>
          <Title level={2}>All runs</Title>
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
            runs={runPageState.runs}
            selectedRuns={selectedRows}
            setSelectedRuns={setSelectedRows}
            onClick={toRunPage}
            isLoading={runPageState?.isLoading}
          />
        </>
      </ContentCardLayout>
    </>
  );
}
