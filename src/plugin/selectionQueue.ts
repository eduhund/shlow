export const { getQueue, setQueue, updateQueue, removeQueue, addToQueue, removeFromQueue } = (() => {
  const queue = [];

  function isObjectInArray(obj, array) {
    return array.some((item) => Object.keys(obj).every((key) => item[key] === obj[key]));
  }

  function addToQueue(nodes) {
    for (const node of nodes) {
      if (!isObjectInArray(node, queue)) {
        queue.push(node);
      }
    }

    return queue;
  }

  function removeFromQueue(nodes) {
    queue.splice(0, queue.length, ...queue.filter((targetItem) => isObjectInArray(targetItem, nodes)));

    return queue;
  }

  function getQueue() {
    return queue;
  }

  function setQueue(nodes) {
    queue.splice(0, queue.length, ...nodes);

    return queue;
  }

  function updateQueue(nodes) {
    if (nodes.length === 0) {
      return removeQueue();
    }
    if (nodes.length === 1) {
      queue[0] = nodes[0];
    }
    if (nodes.length > queue.length) {
      addToQueue(nodes);
    } else {
      removeFromQueue(nodes);
    }

    return queue;
  }

  function removeQueue() {
    queue.length = 0;

    return queue;
  }

  return { getQueue, setQueue, updateQueue, removeQueue, addToQueue, removeFromQueue };
})();
