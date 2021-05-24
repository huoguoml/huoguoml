import * as React from 'react';
import { memo } from 'react';
import { AutoComplete, Button, message, Modal, Select } from 'antd';
import axios from 'axios';
import { ML_MODEL_URI } from '../../../../constants';
import { MLModelRegistryInterface, RunInterface } from '../../../../types';

interface Props {
  run: RunInterface;
}

export const RegisterModelButton = memo((props: Props) => {
  const { Option } = Select;

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [mlModelRegistry, setMlModelRegistry] = React.useState<
    MLModelRegistryInterface[]
  >([]);
  const [mlModelName, setMlModelName] = React.useState<string>('');

  const getMlModel = () => {
    axios
      .get(ML_MODEL_URI)
      .then(response => setMlModelRegistry(response.data))
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

  const modelNotExist = !props.run.model_definition;
  const modelRegistered = !!props.run.ml_model;

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={showModal}
          disabled={modelNotExist || modelRegistered}
        >
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
            {mlModelRegistry.map((registry, index) => (
              <Option key={index} value={registry.name}>
                {registry.name}
              </Option>
            ))}
          </AutoComplete>
        </Modal>
      </div>
    </>
  );
});
