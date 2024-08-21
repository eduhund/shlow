import { checkInitConnector, setInitConnector, createConnector } from './connector';
import { getQueue, updateQueue } from './selectionQueue';

figma.showUI(__html__, {
  width: 340,
  height: 320,
});

!checkInitConnector() &&
  figma.once('selectionchange', () => {
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
    }
  });

figma.ui.onmessage = ({ type, data }) => {
  data;
  switch (type) {
    case 'FOCUS_ON_CANVAS':
      figma.currentPage.selection = [];
      figma.viewport.zoom = figma.viewport.zoom;
    case 'CREATE_CONNECTOR':
      createConnector(getQueue());
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

  figma.ui.postMessage({
    type: 'SET_READY',
  });
});
