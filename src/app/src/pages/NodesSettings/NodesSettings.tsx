import React from 'react';
import { Button, Typography } from 'antd';

const { Title, Text } = Typography;

export default function NodesSettings() {
  function addConnector() {
    parent.postMessage({ pluginMessage: { type: 'CREATE_CONNECTOR' } }, '*');
  }

  return (
    <>
      <Title level={2}>Create connection</Title>
      <div className="main_content">
        <Text>The layers can be connected!</Text>
        <br></br>
        <Button type="primary" onClick={addConnector}>
          Connect
        </Button>
      </div>
    </>
  );
}
