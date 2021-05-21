import * as React from 'react';
import { memo } from 'react';
import { AutoComplete, Button, Input, message, Modal, Select } from 'antd';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { MLModelInterface, RunInterface } from '../../../../types';

interface Props {
  run: RunInterface;
  disabled?: boolean;
}

export const RegisterModelButton = memo((props: Props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [mlModels, setMlModels] = React.useState<MLModelInterface[]>([]);
  const [mlModelName, setMlModelName] = React.useState<string>('');

  const getMlModel = () => {
    axios
      .get(ML_MODEL_URI)
      .then(response => setMlModels(response.data))
      .catch(error => console.log(error));
  };

  const showModal = () => {
    setIsModalVisible(true);
    getMlModel();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMlModelName('');
  };

  const registerModel = () => {
    if (mlModelName) {
      axios
        .post(`${ML_MODEL_URI}`, {
          name: mlModelName,
          run_id: props.run.id,
        })
        .then(response => {
          message.success(`Added model to ${mlModelName}`);
          handleCancel();
        })
        .catch(error => {
          message.error(error.message);
        });
    }
  };

  return (
    <>
      <div>
        <Button type="primary" onClick={showModal} disabled={props.disabled}>
          Register
        </Button>
        <Modal
          title="Register Modal to Registry"
          visible={isModalVisible}
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
              Register
            </Button>,
          ]}
        >
          <p>Select a existing or type the name of a new Model Registry</p>
          <AutoComplete
            style={{ width: '100%' }}
            placeholder="Select a existing or type the name of a new Model Registry"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option
                ? option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                : false
            }
            onChange={value => setMlModelName(String(value))}
            onSearch={setMlModelName}
            onSelect={value => setMlModelName(String(value))}
          >
            {mlModels.map(mlModel => (
              <Option key={mlModel.id} value={mlModel.name}>
                {mlModel.name}
              </Option>
            ))}
          </AutoComplete>
        </Modal>
      </div>
    </>
  );
});
