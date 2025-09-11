/**
 * Test component for CopyButtonWithDropdown
 * Used to verify dropdown functionality
 */

import React from 'react';
import { CopyButtonWithDropdown } from '../';

const CopyButtonTest: React.FC = () => {
  const testArtifacts = [
    {
      content: `# Hello World

This is a **markdown** document with some content.

\`\`\`javascript
function hello() {
  console.log("Hello, World!");
}
\`\`\`

- Item 1
- Item 2
- Item 3`,
      mimeType: 'text/markdown',
      title: 'Markdown Test',
    },
    {
      content: `<!DOCTYPE html>
<html>
<head>
  <title>Test HTML</title>
</head>
<body>
  <h1>Hello World</h1>
  <p>This is a test HTML document.</p>
</body>
</html>`,
      mimeType: 'text/html',
      title: 'HTML Test',
    },
    {
      content: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}`,
      mimeType: 'application/vnd.ant.code.javascript',
      title: 'JavaScript Code',
    },
    {
      content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
</svg>`,
      mimeType: 'image/svg+xml',
      title: 'SVG Test',
    },
  ];

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Copy Button Dropdown Test</h2>
      
      {testArtifacts.map((artifact, index) => (
        <div key={index} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
          <h3>{artifact.title} ({artifact.mimeType})</h3>
          <div style={{ marginBottom: '10px' }}>
            <CopyButtonWithDropdown
              artifact={artifact}
              onCopy={() => console.log('Copy clicked')}
              onDownload={() => console.log('Download clicked')}
              onPrint={() => console.log('Print clicked')}
            />
          </div>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            fontSize: '12px',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            {artifact.content.substring(0, 200)}...
          </pre>
        </div>
      ))}
    </div>
  );
};

export default CopyButtonTest;
