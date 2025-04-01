import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

export default function CreateInitConnector() {
  return (
    <>
      <Title level={2}>Almost done! </Title>
      <div className="main_content">
        <Text>
          <ol>
            <li>Click on any space inside this plugin window (here, for example)</li>
            <li>
              Press <Text strong>⌘+C</Text> on Mac (<Text strong>Ctrl+C</Text> on Windows)
            </li>
            <li>Click on the empty space on the canvas (don't select any layer)</li>
            <li>
              Press <Text strong>⌘+V</Text> on Mac (<Text strong>Ctrl+V</Text> on Windows)
            </li>
          </ol>
        </Text>
        <Text>The initial connector will be set up for the further work.</Text>
      </div>
    </>
  );
}
