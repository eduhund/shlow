import connectorTemplate from './arrowString';

const { checkInitConnector, setInitConnector, createConnector } = (() => {
  let initConnector: ConnectorNode | null = null;

  function checkInitConnector() {
    const allConnectors = figma.currentPage.findAllWithCriteria({
      types: ['CONNECTOR'],
    });

    initConnector = allConnectors.find((connector) => connector.name === '_flow-init-connector') || null;

    if (!initConnector) {
      figma.ui.postMessage({
        type: 'GET_INIT_CONNECTOR',
        data: { connectorTemplate },
      });
      return false;
    }

    return true;
  }

  //function getInitConnector() {
  //  return (
  //    initConnector ||
  //    figma.ui.postMessage({
  //      type: 'GET_INIT_CONNECTOR',
  //      data: { connectorTemplate },
  //    })
  //  );
  //}

  function setInitConnector(node: ConnectorNode) {
    initConnector = node;
  }

  function createConnector(nodes: readonly SceneNode[]) {
    if (initConnector) {
      const newConnector = initConnector.clone();
      newConnector.connectorStart = {
        endpointNodeId: nodes[0].id,
        magnet: 'AUTO',
      };
      newConnector.connectorEnd = {
        endpointNodeId: nodes[1].id,
        magnet: 'AUTO',
      };
      newConnector.connectorLineType = 'ELBOWED';
    }
  }

  return {
    checkInitConnector,
    setInitConnector,
    createConnector,
  };
})();

figma.showUI(__html__);
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
  }
};

figma.on('selectionchange', () => {
  const nodes = figma.currentPage.selection;
  if (nodes.length === 2) {
    createConnector(nodes);
  }
});
