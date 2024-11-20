import React, { useEffect, useRef, useState } from 'react';
import '../styles/ui.css';
import { Button, Typography } from 'antd';

const { Title, Text, Link } = Typography;

type PageType = 'main' | 'buy';

type GeneralPageProps = {
  navTo: (page: PageType) => void;
};

const Buy = React.forwardRef(({ navTo }: GeneralPageProps, ref: React.Ref<any>) => {
  const [isEmailValid, setIsEmailValid] = useState(true);

  function checkSubscription(email) {
    setIsEmailValid(true);
    parent.postMessage(
      {
        pluginMessage: {
          type: 'CHECK_EMAIL',
          email,
        },
      },
      '*'
    );
  }

  React.useImperativeHandle(ref, () => ({
    checkSubscription,
  }));

  return (
    <>
      <Button type="link" onClick={() => navTo('main')}>
        Back
      </Button>
      <div className="block features">
        <Title level={3}>What will you get?</Title>
        <ul>
          <li>
            <Text>Freedom to create as detailed user flows as you need</Text>
          </li>
          <li>
            <Text>All future updates</Text>
          </li>
        </ul>
      </div>
      <div className="block instruction">
        <Title level={3}>Steps to buy</Title>
        <ol>
          <li>
            <Text>
              Go to the <Link href="https://eduhund.gumroad.com/l/shlow">Shlow page</Link> on Gumroad and join the
              monthly subscription. In the order provide a valid email and your name to continue
            </Text>
          </li>
          <li>
            <Text>
              Wait 1-2 minutes (while we receive your subscription details) and enter the email you provided on Gumroad
            </Text>
          </li>
          <form className="subscription_form" onSubmit={checkSubscription}>
            <input type="email" placeholder="type@email.here" />
            <button type="submit">Check</button>
          </form>
          <span id="email_error" className={'email_error' + isEmailValid && ' _hidden'}>
            We can't find this email
          </span>
        </ol>
        <Text>When succeed, this modal will close and you can start using the plugin.</Text>
        <Text>
          Please <a href="mailto:we@eduhund.com">contact us</a> if you experience any problems.
        </Text>
      </div>
      <footer className="main_footer">
        <Text>
          <Link underline>Roman Nebel</Link> → <Link underline>eduHund</Link>
        </Text>
        <nav className="footer_nav">
          <Text>
            <Link underline href="https://eduhund.gumroad.com/l/shlow">
              Q&A
            </Link>
          </Text>
          <Text>
            <Link underline href="mailto:we@eduhund.com">
              Contact us
            </Link>
          </Text>
        </nav>
      </footer>
    </>
  );
});

const Main = React.forwardRef(({}, ref: React.Ref<any>) => {
  const [status, setStatus] = useState('ready');
  function getInput() {
    return document.getElementById('inputArea') as HTMLInputElement;
  }

  function getConnector(template) {
    if (template) {
      const input = getInput();
      input.focus();
      input.value = template;
      document.execCommand('copy');
      input.blur();
      parent.postMessage({ pluginMessage: { type: 'FOCUS_ON_CANVAS' } }, '*');
    }
  }

  function addConnector() {
    parent.postMessage({ pluginMessage: { type: 'CREATE_CONNECTOR' } }, '*');
  }

  document.addEventListener('copy', function (event) {
    event.preventDefault();
    const clipboard = event.clipboardData;
    const input = getInput();
    clipboard.setData('text/html', input.value);
  });

  React.useImperativeHandle(ref, () => ({
    getConnector,
    setStatus,
  }));

  return (
    <>
      <div id={status}>
        {status === 'waitForConnector' && (
          <>
            <Title level={2}>Almost done! </Title>
            <div className="main_content">
              <Text>
                Click on the empty space on the canvas (don't select any layer) and press <Text strong>⌘+V</Text> on Mac
                (or
                <Text strong> Ctrl+V</Text> on Windows).
              </Text>
              <br></br>
              <Text>The initial connector will be set up for the further work.</Text>
            </div>
          </>
        )}
        {status === 'ready' && (
          <>
            <Title level={2}>The plugin is ready!</Title>
            <div className="main_content">
              <Text>
                Choose <Text strong>two nodes</Text> to make a flow, or select any <Text strong>connector</Text> to
                manage it
              </Text>
            </div>
          </>
        )}
        {status === 'connectorSettings' && (
          <>
            <Title level={2}>Edit connector</Title>
            <div className="main_content">
              <Text>Settings will be here soon</Text>
            </div>
          </>
        )}
        {status === 'nodesSettings' && (
          <>
            <Title level={2}>Create connection</Title>
            <div className="main_content">
              <Text>The layers can be connected!</Text>
              <br></br>
              <Button type="primary" onClick={addConnector}>
                Connect
              </Button>
            </div>
          </>
        )}
      </div>
      <footer className="main_footer">
        <Text>
          <Link underline>Roman Nebel</Link> → <Link underline>eduHund</Link>
        </Text>
        <nav className="footer_nav">
          <Text>
            <Link underline href="https://eduhund.gumroad.com/l/shlow">
              Q&A
            </Link>
          </Text>
          <Text>
            <Link underline href="mailto:we@eduhund.com">
              Contact us
            </Link>
          </Text>
        </nav>
      </footer>
      <textarea name="" id="inputArea"></textarea>
    </>
  );
});

function App() {
  const [currentPage, setCurrentPage] = useState('main');

  const mainRef = useRef<any>(null);
  const buyRef = useRef<any>(null);

  function changeCurrentPageHandler(page: PageType) {
    setCurrentPage(page);
  }

  useEffect(() => {
    window.onmessage = (event) => {
      const { type, data } = event.data.pluginMessage;
      switch (type) {
        case 'NAV':
          const { page } = data;
          changeCurrentPageHandler(page);
          return;
        case 'EMAIL_STATUS':
          buyRef.current.checkSubscription(data?.email);
        case 'GET_INIT_CONNECTOR':
          mainRef.current.getConnector(data.connectorTemplate);
          mainRef.current.setStatus('waitForConnector');
          return;
        case 'CONFIG_NODES':
          mainRef.current.setStatus('nodesSettings');
          return;
        case 'CONFIG_CONNECTOR':
          mainRef.current.setStatus('connectorSettings');
          return;
        default:
          mainRef.current.setStatus('ready');
      }
    };

    parent.postMessage({ pluginMessage: { type: 'UI_READY' } }, '*');
  }, []);

  return (
    <>
      {currentPage === 'main' && <Main ref={mainRef} />}
      {currentPage === 'buy' && <Buy ref={buyRef} navTo={changeCurrentPageHandler} />}
    </>
  );
}

export default App;
