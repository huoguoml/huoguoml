import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Checkbox, Col, Divider, Popover, Row, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';

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

  const plotData = checkedList.map(metric => {
    return {
      series: [
        {
          name: metric,
          data: props.runs.map(run => [
            run.run_nr,
            //@ts-ignore
            run.metrics[metric],
          ]),
        },
      ],
      options: {
        chart: {
          type: 'scatter',
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          labels: {
            formatter: function (val) {
              return parseFloat(val);
            },
          },
        },
        yaxis: {
          tickAmount: 7,
        },
        title: {
          text: metric,
        },
      },
    };
  });
  const { Title } = Typography;

  return (
    <>
      <Title level={4}>Metric Charts</Title>
      <Popover placement="bottomLeft" content={menu} trigger="click">
        <SettingOutlined />
      </Popover>
      <Row gutter={[8, 8]}>
        <>
          {plotData.map(data => (
            <Col sm={{ span: 24 }} md={{ span: 8 }}>
              <Chart
                options={data.options}
                series={data.series}
                type="scatter"
                height={280}
              />
            </Col>
          ))}
        </>
      </Row>
    </>
  );
});
