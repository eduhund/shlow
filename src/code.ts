import { node } from "webpack";
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
    case "FOCUS_ON_CANVAS":
      figma.currentPage.selection = [];
      figma.viewport.zoom = figma.viewport.zoom;
  }
};

figma.once("selectionchange", () => {
  const nodes = figma.currentPage.selection;

  if (nodes.length === 1 && nodes[0].type === "CONNECTOR") {
    const arrow = nodes[0];
    figma.currentPage.selection = [];
    figma.currentPage.insertChild(0, arrow);
    arrow.x = -131100;
    arrow.y = -131100;
    arrow.visible = false;
    arrow.locked = true;
    arrow.name = "_flow-init-arrow";
  }

  if (nodes.length === 2) {
    createConnector(nodes);
  }
});
