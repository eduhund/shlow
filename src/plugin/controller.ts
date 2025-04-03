import { createInitConnector, createConnector, checkInitConnector, setInitConnector } from './connector';
import { getQueue, updateQueue } from './selectionQueue';
import { sendUIAction } from './UIController';
import connectorTemplate from './arrowString';

function initConnectorHandler() {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 1 && nodes[0].type === 'CONNECTOR') {
    const arrow = nodes[0];
    figma.currentPage.selection = [];
    figma.currentPage.insertChild(0, arrow);
    arrow.x = -131100;
    arrow.y = -131100;
    arrow.visible = false;
    arrow.locked = true;
    arrow.name = '_flow-init-connector';
    setInitConnector(arrow);
    sendUIAction('SET_STANDBY');
  }
}

async function run() {
  try {
    figma.showUI(__html__, {
      width: 340,
      height: 320,
      visible: false,
    });
    const initNotification = figma.notify('Initialize the plugin...');
    await new Promise((resolve) => {
      setTimeout(() => {
        createInitConnector();
        resolve('');
      });
    });
    initNotification.cancel();
    figma.ui.show();
  } catch {
    figma.notify('Plugin was failed. Plese, mail us: we@eduhund.com', { error: true, timeout: 5000 });
  }
}

figma.ui.onmessage = async (message) => {
  const { type } = message;
  switch (type) {
    case 'FOCUS_ON_CANVAS':
      figma.currentPage.selection = [];
      figma.viewport.zoom = figma.viewport.zoom;
      break;
    case 'CREATE_CONNECTOR':
      const creationResult = await createConnector(getQueue());
      if (!creationResult) {
        figma.once('selectionchange', initConnectorHandler);
        sendUIAction('GET_INIT_CONNECTOR', { connectorTemplate });
      }
      break;
    case 'UI_READY':
      if (!checkInitConnector()) {
        figma.once('selectionchange', initConnectorHandler);
        sendUIAction('GET_INIT_CONNECTOR', { connectorTemplate });
      }
      break;
  }
};

figma.on('selectionchange', () => {
  const nodes = figma.currentPage.selection;
  const selectionQueue = updateQueue(nodes);
  if (selectionQueue.length === 2 && selectionQueue[0].type !== 'CONNECTOR' && selectionQueue[1].type !== 'CONNECTOR') {
    figma.ui.postMessage({
      type: 'CONFIG_NODES',
    });
    return;
  }
  if (selectionQueue.length === 1 && selectionQueue[0].type === 'CONNECTOR') {
    figma.ui.postMessage({
      type: 'CONFIG_CONNECTOR',
    });
    return;
  }

  if (!checkInitConnector()) {
    return;
  }

  figma.ui.postMessage({
    type: 'SET_READY',
  });
});

run();
