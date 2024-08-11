import React, { useEffect, useState } from 'react';
import '../styles/ui.css';
import { Button } from 'antd';

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
        case 'CONFIG_CONNECTOR':
          setStatus('connectorSettings');
      }
    };
  }, []);

  document.addEventListener('copy', function (event) {
    event.preventDefault();
    const clipboard = event.clipboardData;
    const input = getInput();
    clipboard.setData('text/html', input.value);
  });

  return (
    <>
      {status === 'waitForConnector' && <p>Press ⌘+P</p>}
      {status === 'ready' && <p>Choose two nodes to make a flow</p>}
      {status === 'connectorSettings' && <p>Connector selected</p>}
      {status === 'nodesSettings' && (
        <>
          <p>Can be connected</p>
          <Button>Connect</Button>
        </>
      )}
      <textarea name="" id="inputArea"></textarea>
    </>
  );
}

export default App;
