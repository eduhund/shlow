import initArrow from "./arrowString";

const { setupConnector, createConnector } = (() => {
  let initConnector: ConnectorNode | null = null;

  function setupConnector() {
    const selectedNode = figma.currentPage.selection[0];

    if (selectedNode?.type === "CONNECTOR") {
      initConnector = selectedNode;
      return true;
    }

    const currentConnector = figma.currentPage.findAllWithCriteria({
      types: ["CONNECTOR"],
    })[0];

    if (currentConnector) {
      initConnector = currentConnector;
      return true;
    }

    figma.notify("Plugin started, but we can't find the Connector Node", {
      button: {
        text: "More info",
        action: () => {},
      },
    });

    return false;
  }

  function createConnector(nodes: readonly SceneNode[]) {
    if (initConnector) {
      const newConnector = initConnector.clone();
      newConnector.connectorStart = {
        endpointNodeId: nodes[0].id,
        magnet: "AUTO",
      };
      newConnector.connectorEnd = {
        endpointNodeId: nodes[1].id,
        magnet: "AUTO",
      };
      newConnector.connectorLineType = "ELBOWED";
    }
  }

  return { setupConnector, createConnector };
})();

figma.showUI(__html__);

figma.ui.postMessage({ type: "GET_INIT_ARROW", data: { initArrow } });

figma.ui.onmessage = ({ type, data }) => {
  data;
  switch (type) {
    case "GET_CONNECTOR":
      setupConnector() && figma.ui.postMessage({ type: "CONNECTOR_FOUND" });
  }
};

figma.on("selectionchange", () => {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 2) {
    createConnector(nodes);
  }
});
