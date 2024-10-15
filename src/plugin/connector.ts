function checkIfNested(id = '') {
  return id.includes(';');
}

function getParentRecursive(node) {
  if (checkIfNested(node.id)) {
    return getParentRecursive(node?.parent);
  } else return node;
}

function calculatePosition(firstNode, secondNode) {
  const { x: firstX, y: firstY, width: firstWidth, height: firstHeight } = firstNode.absoluteBoundingBox;
  const { x: secondX /*y: secondY, width: secondWidth, height: secondHeight*/ } = secondNode.absoluteBoundingBox;

  const {
    id: parentNodeId,
    absoluteBoundingBox: { x: parentX, y: parentY },
  } = getParentRecursive(firstNode);

  const targetPositionX = firstX - parentX;
  const targetPositionY = firstY - parentY;

  if (firstX > secondX) {
    return {
      parentNodeId,
      endpointPosition: {
        x: targetPositionX,
        y: targetPositionY + firstHeight / 2,
      },
    };
  } else {
    return {
      parentNodeId,
      endpointPosition: {
        x: targetPositionX + firstWidth,
        y: targetPositionY + firstHeight / 2,
      },
    };
  }
}

function createConnectorEdge(nodes, position): ConnectorEndpoint {
  const positionIndex = position === 'end' ? 1 : 0;
  if (checkIfNested(nodes[positionIndex].id)) {
    const oppositePositionIndex = position === 'end' ? 0 : 1;

    const { parentNodeId, endpointPosition } = calculatePosition(nodes[positionIndex], nodes[oppositePositionIndex]);

    return {
      endpointNodeId: parentNodeId,
      position: endpointPosition,
    };
  } else {
    return {
      endpointNodeId: nodes[positionIndex].id,
      magnet: 'AUTO',
    };
  }
}

export const { checkInitConnector, setInitConnector, createConnector } = (() => {
  let initConnector: ConnectorNode | null = null;

  function checkInitConnector() {
    const allConnectors = figma.currentPage.findAllWithCriteria({
      types: ['CONNECTOR'],
    });

    initConnector = allConnectors.find((connector) => connector.name === '_flow-init-connector') || null;

    if (!initConnector) {
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
      newConnector.connectorStart = createConnectorEdge(nodes, 'start');
      newConnector.connectorEnd = createConnectorEdge(nodes, 'end');
      newConnector.connectorLineType = 'ELBOWED';
      newConnector.visible = true;
      newConnector.locked = false;
      newConnector.name = 'Flow Connector';
      newConnector.strokeWeight = 4;
      newConnector.strokes = [
        {
          type: 'SOLID',
          color: { r: 0.6, g: 0.6, b: 0.6 },
          opacity: 0.8,
        },
      ];
      figma.currentPage.selection = [newConnector];
    }
  }

  return {
    checkInitConnector,
    setInitConnector,
    createConnector,
  };
})();
