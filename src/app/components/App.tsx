import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import { Button, Typography } from 'antd';

const { Title, Text, Link } = Typography;

function App() {
  const [status, setStatus] = useState('ready');
  function getInput() {
    return document.getElementById('inputArea') as HTMLInputElement;
  }

  function getConnector(template) {
    if (template) {
      const input = getInput();
      input.focus();
      input.value = template;
      document.execCommand('copy');
      input.blur();
      parent.postMessage({ pluginMessage: { type: 'FOCUS_ON_CANVAS' } }, '*');
    }
  }

  function addConnector() {
    parent.postMessage({ pluginMessage: { type: 'CREATE_CONNECTOR' } }, '*');
  }

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      switch (type) {
        case 'GET_INIT_CONNECTOR':
          getConnector(data.connectorTemplate);
          setStatus('waitForConnector');
          return;
        case 'CONFIG_NODES':
          setStatus('nodesSettings');
          return;
        case 'CONFIG_CONNECTOR':
          setStatus('connectorSettings');
          return;
        default:
          setStatus('ready');
      }
    };

    parent.postMessage({ pluginMessage: { type: 'UI_READY' } }, '*');
  }, []);

  document.addEventListener('copy', function (event) {
    event.preventDefault();
    const clipboard = event.clipboardData;
    const input = getInput();
    clipboard.setData('text/html', input.value);
  });

  return (
    <>
      <div id={status}>
        {status === 'waitForConnector' && (
          <>
            <Title level={2}>Almost done! </Title>
            <div className="main_content">
              <Text>
                Click on the empty space on the canvas (don't select any layer) and press <Text strong>⌘+V</Text> on Mac
                (or
                <Text strong>Ctrl+V</Text> on Windows).
              </Text>
              <br></br>
              <Text>The initial connector will be set up for the further work.</Text>
            </div>
          </>
        )}
        {status === 'ready' && (
          <>
            <Title level={2}>The plugin is ready!</Title>
            <div className="main_content">
              <Text>
                Choose <Text strong>two nodes</Text> to make a flow, or select any <Text strong>connector</Text> to
                manage it
              </Text>
            </div>
          </>
        )}
        {status === 'connectorSettings' && (
          <>
            <Title level={2}>Edit connector</Title>
            <div className="main_content">
              <Text>Settings will be here soon</Text>
            </div>
          </>
        )}
        {status === 'nodesSettings' && (
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
        )}
      </div>
      <footer className="main_footer">
        <Text>
          <Link underline>Roman Nebel</Link> → <Link underline>eduHund</Link>
        </Text>
        <nav className="footer_nav">
          <Link underline>Q&A</Link>
          <Link underline>Contacts</Link>
        </nav>
      </footer>
      <textarea name="" id="inputArea"></textarea>
    </>
  );
}

export default App;
