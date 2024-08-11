import React from 'react';
import '../styles/ui.css';

function App() {
  function getConnector(template) {
    if (template) {
      const input = document.getElementById('inputArea') as HTMLInputElement;
      input.focus();
      input.value = template;
      document.execCommand('copy');
      input.blur();
      parent.postMessage({ pluginMessage: { type: 'FOCUS_ON_CANVAS' } }, '*');
    }
  }

  React.useEffect(() => {
    // This is how we read messages sent from the plugin controller
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
    const input = document.getElementById('inputArea') as HTMLInputElement;
    clipboard.setData('text/html', input.value);
  });

  return (
    <>
      <textarea name="" id="inputArea" cols={30} rows={10}></textarea>
      <h1>Hello</h1>
    </>
  );
}

export default App;
