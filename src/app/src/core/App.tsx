import React, { useEffect, useState } from 'react';

import { Footer } from '../components';
import { ConnectorSettings, CreateInitConnector, NodesSettings, StandBy } from '../pages';

import '../styles/ui.css';

function App() {
  const [status, setStatus] = useState('standBy');

  function getInput() {
    return document.getElementById('inputArea') as HTMLInputElement;
  }

  function getConnector(template) {
    if (template) {
      const input = getInput();
      input.focus();
      input.value = template;
      input.select();
      parent.postMessage({ pluginMessage: { type: 'FOCUS_ON_CANVAS' } }, '*');
    }
  }

  document.addEventListener('copy', function (event) {
    event.preventDefault();
    const clipboard = event.clipboardData;
    const input = getInput();
    clipboard.setData('text/html', input.value);
    input.blur();
  });

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
          setStatus('standBy');
      }
    };

    parent.postMessage({ pluginMessage: { type: 'UI_READY' } }, '*');
  }, []);

  return (
    <>
      <div id={status}>
        {status === 'waitForConnector' && <CreateInitConnector />}
        {status === 'standBy' && <StandBy />}
        {status === 'connectorSettings' && <ConnectorSettings />}
        {status === 'nodesSettings' && <NodesSettings />}
      </div>
      <Footer />
      <textarea name="" id="inputArea"></textarea>
    </>
  );
}

export default App;
