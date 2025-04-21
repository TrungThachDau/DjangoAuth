import React from 'react';
import { Button, message, Space } from 'antd';
const MessageDialog = (props) => {
  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: 'success',
      content: props.success,
    });
  };
  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'This is an error message',
    });
  };
  const warning = () => {
    messageApi.open({
      type: 'warning',
      content: 'This is a warning message',
    });
  };
  return (
    <>
      {contextHolder}
      <Space>
          if (props.success) {
        <Button type="primary" onClick={success}>
            {props.success}
        </Button>
        }
        if (props.error) {
        <Button type="primary" onClick={error}>
            {props.error}
        </Button>
        }
        if (props.warning) {
        <Button type="primary" onClick={warning}>
            {props.warning}
        </Button>
        }
      </Space>
    </>
  );
};
export default MessageDialog;