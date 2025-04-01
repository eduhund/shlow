import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function StandBy() {
  return (
    <>
      <Title level={2}>The plugin is ready!</Title>
      <div className="main_content">
        <Text>
          Choose <Text strong>two nodes</Text> to make a flow, or select any <Text strong>connector</Text> to manage it
        </Text>
      </div>
    </>
  );
}
