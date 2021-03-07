import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Scatter } from '@ant-design/charts';
import { Checkbox, Col, Divider, Popover, Row } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

interface Props {
  runs: RunInterface[];
}

const getUniqueKeys = (runs: RunInterface[], field_name: string): string[] => {
  const record_keys = runs.flatMap(run =>
    run.metrics ? Object.keys(run[field_name]) : undefined,
  );
  // @ts-ignore
  return Array.from(new Set(record_keys)).filter(x => x);
};

export const RunMetricCharts = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();

  const metrics = getUniqueKeys(props.runs, 'metrics');

  const [checkedList, setCheckedList] = React.useState(metrics.slice(0, 3));
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = list => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < metrics.length);
    setCheckAll(list.length === metrics.length);
  };

  const onCheckAllChange = e => {
    setCheckedList(e.target.checked ? metrics : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };
  const CheckboxGroup = Checkbox.Group;

  const menu = (
    <>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onCheckAllChange}
        checked={checkAll}
      >
        Check all
      </Checkbox>
      <Divider />
      <p>Metric Display:</p>
      <CheckboxGroup
        options={metrics}
        value={checkedList}
        onChange={onChange}
      />
    </>
  );

  const plotData = checkedList.map(metric =>
    props.runs.map(run => {
      return {
        run_nr: run.run_nr,
        // @ts-ignore
        metric_value: run.metrics[metric],
        metric_name: metric,
      };
    }),
  );

  const plotConfigs = plotData.map(plotData => {
    return {
      data: plotData,
      xField: 'run_nr',
      yField: 'metric_value',
      size: 5,
      padding: 25,
      pointStyle: {
        stroke: '#777777',
        lineWidth: 1,
        fill: '#5B8FF9',
      },
      yAxis: {
        nice: true,
        line: { style: { stroke: '#aaa' } },
      },
      xAxis: {
        grid: { line: { style: { stroke: '#eee' } } },
        line: { style: { stroke: '#aaa' } },
      },
      tooltip: {
        fields: ['run_nr', 'metric_value', 'metric_name'],
        formatter: metric => {
          return {
            name: metric.metric_name,
            value: metric.metric_value,
            test: 1,
          };
        },
        title: title => {
          return `Run ${title}`;
        },
        enterable: true,
        showTitle: true,
      },
    };
  });

  return (
    <>
      <Popover placement="bottomLeft" content={menu} trigger="click">
        <SettingOutlined />
      </Popover>
      <Row gutter={[8, 8]}>
        {plotConfigs.map(plotConfig => (
          <>
            <Col sm={{ span: 24 }} md={{ span: 8 }} style={{ height: 300 }}>
              <Scatter {...plotConfig} />
            </Col>
          </>
        ))}
      </Row>
    </>
  );
});
