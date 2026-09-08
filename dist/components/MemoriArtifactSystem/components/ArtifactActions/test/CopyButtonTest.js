"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const __1 = require("../");
const CopyButtonTest = () => {
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
    return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Copy Button Dropdown Test" }), testArtifacts.map((artifact, index) => ((0, jsx_runtime_1.jsxs)("div", { style: { border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }, children: [(0, jsx_runtime_1.jsxs)("h3", { children: [artifact.title, " (", artifact.mimeType, ")"] }), (0, jsx_runtime_1.jsx)("div", { style: { marginBottom: '10px' }, children: (0, jsx_runtime_1.jsx)(__1.CopyButtonWithDropdown, { artifact: artifact, onCopy: () => console.log('Copy clicked'), onDownload: () => console.log('Download clicked'), onPrint: () => console.log('Print clicked') }) }), (0, jsx_runtime_1.jsxs)("pre", { style: {
                            background: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            maxHeight: '200px',
                            overflow: 'auto'
                        }, children: [artifact.content.substring(0, 200), "..."] })] }, index)))] }));
};
exports.default = CopyButtonTest;
//# sourceMappingURL=CopyButtonTest.js.map