import React from 'react';
import '../styles/ui.css';

function App() {
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

  React.useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      switch (type) {
        case 'GET_INIT_CONNECTOR':
          getConnector(data.connectorTemplate);
          return;
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
      <textarea name="" id="inputArea"></textarea>
    </>
  );
}

export default App;
