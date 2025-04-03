export function sendUIAction(action: string, data?: any) {
  switch (action) {
    case 'SET_STANDBY':
      return setStandBy();
    case 'GET_INIT_CONNECTOR':
      return setInitConnector(data);
  }
}

function setStandBy() {
  return figma.ui.postMessage({
    type: 'SET_STANDBY',
  });
}

function setInitConnector(data) {
  return figma.ui.postMessage({
    type: 'GET_INIT_CONNECTOR',
    data,
  });
}
