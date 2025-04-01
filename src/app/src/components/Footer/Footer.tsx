import React from 'react';
import { Typography } from 'antd';

const { Text, Link } = Typography;

export default function Footer() {
  return (
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
  );
}
