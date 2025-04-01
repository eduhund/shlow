import { createInitConnector, createConnector, checkInitConnector } from './connector';
import { getQueue, updateQueue } from './selectionQueue';

function run() {
  try {
    figma.showUI(__html__, {
      width: 340,
      height: 320,
    });
    const initNotification = figma.notify('Initialize the plugin...');
    createInitConnector();
    initNotification.cancel();
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
      await createConnector(getQueue());
      break;
    case 'UI_READY':
      createInitConnector();
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
