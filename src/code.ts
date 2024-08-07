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

/*
get absoluteBoundingBox: ƒ (),
get absoluteTransform: ƒ (),
get attachedConnectors: ƒ (),
get blendMode: ƒ (),
set blendMode: ()=>{},
get connectorEnd: ƒ (),
set connectorEnd: ()=>{},
get connectorEndStrokeCap: ƒ (),
set connectorEndStrokeCap: ()=>{},
get connectorLineType: ƒ (),
set connectorLineType: ()=>{},
get connectorStart: ƒ (),
set connectorStart: ()=>{},
get connectorStartStrokeCap: ƒ (),
set connectorStartStrokeCap: ()=>{},
get cornerRadius: ƒ (),
set cornerRadius: ()=>{},
get dashPattern: ƒ (),
set dashPattern: ()=>{},
get detachedInfo: ƒ (),
get exportSettings: ƒ (),
set exportSettings: ()=>{},
get height: ƒ (),
get isAsset: ƒ (),
get locked: ƒ (),
set locked: ()=>{},
get name: ƒ (),
set name: ()=>{},
get opacity: ƒ (),
set opacity: ()=>{},
get parent: ƒ (),
get relativeTransform: ƒ (),
set relativeTransform: ()=>{},
get removed: ƒ (),
get rotation: ƒ (),
set rotation: ()=>{},
get strokeAlign: ƒ (),
set strokeAlign: ()=>{},
get strokeJoin: ƒ (),
set strokeJoin: ()=>{},
get strokeStyleId: ƒ (),
set strokeStyleId: ()=>{},
get strokeWeight: ƒ (),
set strokeWeight: ()=>{},
get strokes: ƒ (),
set strokes: ()=>{},
get stuckNodes: ƒ (),
get text: ƒ (),
get textBackground: ƒ (),
get visible: ƒ (),
set visible: ()=>{},
get width: ƒ (),
get x: ƒ (),
set x: ()=>{},
get y: ƒ (),
set y: ()=>{},

const textSublayerNode = figma.createText();
  const el = figma.createVector();
  const Connector: any = {
    id: el.id,
    type: "CONNECTOR",
    absoluteBoundingBox: {
      height: 0,
      width: 200,
      x: 0,
      y: 0,
    },
    absoluteTransform: [
      [1, 0, 0],
      [0, 1, 0],
    ],
    attachedConnectors: [],
    blendMode: "PASS_THROUGH",
    connectorEnd: {
      endpointNodeId: "0:1",
      position: {
        x: 200,
        y: 0,
      },
    },
    connectorEndStrokeCap: "ARROW_LINES",
    connectorLineType: "ELBOWED",
    connectorStart: {
      endpointNodeId: "0:1",
      position: {
        x: 0,
        y: 0,
      },
    },
    connectorStartStrokeCap: "NONE",
    cornerRadius: 24,
    dashPattern: [],
    exportSettings: [],
    height: 0,
    isAsset: false,
    locked: false,
    name: "Connector line",
    opacity: 1,
    parent: null,
    relativeTransform: [
      [1, 0, 0],
      [0, 1, 0],
    ],
    removed: false,
    rotation: 0,
    strokeAlign: "CENTER",
    strokeJoin: "BEVEL",
    strokeStyleId: "",
    strokeWeight: 4,
    strokes: [
      {
        type: "SOLID",
        visible: true,
        opacity: 1,
        blendMode: "NORMAL",
        color: {
          r: 0.7019608020782471,
          g: 0.7019608020782471,
          b: 0.7019608020782471,
        },
        boundVariables: {},
      },
    ],
    text: textSublayerNode,
    textBackground: {
      fills: [],
    },
    visible: true,
    width: 100,
    x: 0,
    y: 0,
    addDevResourceAsync: async () => {},
    addRelatedLinkAsync: () => {},
    clone: () => {},
    constructor: () => {},
    deleteDevResourceAsync: async () => {},
    deleteRelatedLinkAsync: () => {},
    editDevResourceAsync: async () => {},
    editRelatedLinkAsync: () => {},
    exportAsync: async () => [],
    getCSSAsync: () => {},
    getDevResourcesAsync: () => {},
    getPluginData: () => {},
    getPluginDataKeys: () => {},
    getRelatedLinksAsync: () => {},
    getRelaunchData: () => {},
    getSharedPluginData: () => {},
    getSharedPluginDataKeys: () => {},
    remove: () => {},
    setDevResourcePreviewAsync: () => {},
    setPluginData: () => {},
    setRelatedLinkPreviewAsync: () => {},
    setRelaunchData: () => {},
    setSharedPluginData: () => {},
    setStrokeStyleIdAsync: () => {},
    toString: () => {},
  };
  console.log(Connector);
*/
