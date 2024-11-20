import { createInitConnector, createConnector, checkInitConnector } from './connector';
import { getQueue, updateQueue } from './selectionQueue';

figma.showUI(__html__, {
  visible: false,
  width: 340,
  height: 320,
});

figma.ui.onmessage = async (message) => {
  const { type } = message;
  switch (type) {
    case 'FOCUS_ON_CANVAS':
      figma.currentPage.selection = [];
      figma.viewport.zoom = figma.viewport.zoom;
      break;
    case 'CREATE_CONNECTOR':
      createConnector(getQueue());
      break;
    case 'UI_READY':
      createInitConnector();
      break;
    case 'CHECK_EMAIL': {
      const { email } = message;
      const result = await checkSubscription(email);

      figma.ui.postMessage({ type: 'EMAIL_STATUS', data: { emailStatus: result } });
    }
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

const { showNotify, closeNotify } = (() => {
  let notify: NotificationHandler | null = null;

  function closeNotify() {
    if (notify) {
      notify.cancel();
      notify = null;
    }
  }

  function showNotify(text: string, settings: NotificationOptions) {
    closeNotify();
    setTimeout(() => (notify = figma.notify(text, settings)), 10);
  }

  return { showNotify, closeNotify };
})();

async function checkSubscription(email?: string) {
  const userId = figma.currentUser?.id || '';
  let uri = `https://mcrprdcts.eduhund.com/api/shlow/check_subscription?user_id=${userId}`;

  if (email) {
    uri += `&email=${email}`;
  }
  try {
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      showNotify('We have some problem. Please, run plugin again, or mail us: we@eduhund.com', {
        error: true,
        timeout: 10 * 1000,
        onDequeue: () => {
          figma.closePlugin();
        },
      });
      return null;
    }

    const data = await response.json();
    return data?.access;
  } catch {
    console.error('Subscribtion check error:');
    figma.closePlugin();
  }
}

async function run() {
  showNotify('Cheking your subscription...', {
    timeout: Infinity,
  });

  const result = await checkSubscription();

  if (result === null) {
    return;
  }

  if (result) {
    figma.ui.show();
    closeNotify();
  } else {
    const timeFromFirstRun = figma?.payments?.getUserFirstRanSecondsAgo() || 0;
    const trialTime = 7;
    const timeRemaining = trialTime - Math.ceil(timeFromFirstRun / (24 * 60 * 60));

    if (timeRemaining < 1) {
      showNotify(`You have reached ${trialTime} days free trial`, {
        timeout: Infinity,
        button: {
          text: 'Get full version',
          action: () => {
            figma.ui.postMessage({
              type: 'NAV',
              data: {
                page: 'buy',
              },
            });
            figma.ui.show();
          },
        },
        onDequeue: (reason) => {
          if (reason !== 'action_button_click') {
            closeNotify();
            figma.closePlugin();
          }
        },
      });
    } else {
      showNotify(`Welcome to Shlow trial (${trialTime} day${trialTime > 1 ? 's' : ''} remaining)`, {
        timeout: Infinity,
        button: {
          text: 'Get full version',
          action: () => {
            figma.ui.postMessage({
              type: 'NAV',
              data: {
                page: 'buy',
              },
            });
          },
        },
        onDequeue: (reason) => {
          if (reason !== 'action_button_click') {
            closeNotify();
            figma.closePlugin();
          }
        },
      });
      figma.ui.show();
    }
  }
}

run();
