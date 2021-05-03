import * as React from 'react';
import { memo } from 'react';
import { Button, Input, message, Modal, Select } from 'antd';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../constants';
import { MLModelInterface, RunInterface } from '../../../types';

interface Props {
  run: RunInterface;
}

export const RegisterModelButton = memo((props: Props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [mlModels, setMlModels] = React.useState<MLModelInterface[]>([]);
  const [mlModelName, setMlModelName] = React.useState<string>('');

  const showModal = () => {
    setIsModalVisible(true);
    axios
      .get(ML_MODEL_URI)
      .then(response => setMlModels(response.data))
      .catch(error => console.log(error));
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const registerModel = () => {
    if (mlModelName) {
      axios
        .put(`${ML_MODEL_URI}/${mlModelName}`, {
          name: mlModelName,
          run: props.run,
        })
        .then(response => {
          message.success(`Added model to ${mlModelName}`);
          setIsModalVisible(false);
          setMlModelName('');
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  };

  return (
    <>
      <div>
        <Button type="primary" onClick={showModal}>
          Register
        </Button>
        <Modal
          title="Register Modal to Registry"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={registerModel}
              disabled={mlModelName.length === 0}
            >
              Submit
            </Button>,
          ]}
        >
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a existing Model Registry"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option
                ? option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                : false
            }
            onSearch={setMlModelName}
            onSelect={value => setMlModelName(String(value))}
          >
            {mlModels.map(mlModel => (
              <Option value={mlModel.name}>{mlModel.name}</Option>
            ))}
          </Select>
          or
          <Input
            placeholder="Type the name of a new Model Registry"
            value={mlModelName}
            onChange={value => setMlModelName(value.target.value)}
          />
        </Modal>
      </div>
    </>
  );
});
