import * as React from 'react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { RunInterface } from '../../../types';
import { Checkbox, Col, Divider, Popover, Row, Typography } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import Chart from 'react-apexcharts';
import { capitalize, getUniqueKeys } from '../../../utils';

interface Props {
  runs: RunInterface[];
}

export const RunMetricCharts = memo((props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t, i18n } = useTranslation();
  const CheckboxGroup = Checkbox.Group;
  const { Title } = Typography;

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
      <p>Display:</p>
      <CheckboxGroup
        options={metrics.map(metric => capitalize(metric))}
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
              return parseFloat(val).toFixed(0);
            },
          },
        },
        title: {
          text: capitalize(metric),
        },
      },
    };
  });
  return (
    <>
      <Row justify={'space-between'} align={'top'}>
        <Col>
          <Title level={2}>Charts</Title>
        </Col>
        <Col>
          <Popover placement="bottomLeft" content={menu} trigger="click">
            <SettingOutlined style={{ fontSize: 22 }} />
          </Popover>
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <>
          {plotData.map((data, index) => (
            <Col key={`col_${index}`} sm={{ span: 24 }} md={{ span: 8 }}>
              <Chart
                key={`metric_chart_${index}`}
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
