/**
 * Chat PDF Export Utilities
 * Modular functions for exporting chat history to PDF with visual UI preservation
 */

import { Message, Memori } from '@memori.ai/memori-api-client/dist/types';
import { renderMsg } from './message';
import { stripOutputTags } from './utils';

export interface ChatPDFOptions {
  fontSize?: string;
  fontFamily?: string;
  lineHeight?: string;
  color?: string;
  backgroundColor?: string;
  primaryColorRgb?: string;
}

export interface ChatPDFExportParams {
  messages: Message[];
  memori: Memori;
  conversationStartedLabel: string;
  language?: string;
}

/**
 * Generate PDF-optimized CSS for chat export
 */
export const generateChatPDFCSS = (options: ChatPDFOptions = {}): string => {
  const {
    fontSize = '12pt',
    fontFamily = 'system-ui, -apple-system, sans-serif',
    lineHeight = '1.6',
    color = '#333',
    backgroundColor = '#fff',
  } = options;

  const baseStyles = `
    @page {
      margin: 1in;
      size: A4;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      body {
        font-family: ${fontFamily};
        font-size: ${fontSize};
        line-height: ${lineHeight};
        color: ${color};
        background-color: ${backgroundColor};
        margin: 0;
        padding: 0;
        max-width: none;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 600;
      }

      h1 { font-size: 1.8em; }
      h2 { font-size: 1.5em; }
      h3 { font-size: 1.3em; }

      p {
        margin: 0 0 1em 0;
        orphans: 3;
        widows: 3;
      }

      pre, code {
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.9em;
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        border-radius: .5rem;
        padding: 0.2em 0.4em;
        page-break-inside: avoid;
      }

      pre {
        padding: 1em;
        overflow-x: auto;
        white-space: pre;
        margin: 1em 0;
      }

      pre code {
        background: none;
        border: none;
        padding: 0;
      }

      blockquote {
        margin: 1em 0;
        padding-left: 1em;
        border-left: 3px solid #ddd;
        font-style: italic;
        page-break-inside: avoid;
      }

      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }

      li {
        margin: 0.25em 0;
        page-break-inside: avoid;
      }

      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        page-break-inside: avoid;
      }

      th, td {
        border: 1px solid #ddd;
        padding: 0.5em;
        text-align: left;
      }

      th {
        background-color: #f5f5f5;
        font-weight: 600;
      }

      a {
        color: #0066cc;
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      img {
        max-width: 100%;
        height: auto;
        page-break-inside: avoid;
      }

      hr {
        margin: 2em 0;
        border: none;
        border-top: 1px solid #ddd;
      }

      .page-break {
        page-break-before: always;
      }

      .no-print {
        display: none !important;
      }
    }

    @media screen {
      body {
        font-family: ${fontFamily};
        font-size: ${fontSize};
        line-height: ${lineHeight};
        color: ${color};
        background-color: ${backgroundColor};
        margin: 20px;
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
    }
  `;

  const chatBubbleStyles = generateChatBubbleStyles(options.primaryColorRgb);

  return `<style>${baseStyles}${chatBubbleStyles}</style>`;
};

/**
 * Generate CSS styles for chat bubbles
 */
const generateChatBubbleStyles = (primaryColorRgb?: string): string => {
  // Default fallback if not provided
  const rgbValue = primaryColorRgb || '130, 70, 175';
  
  return `
    :root {
      --memori-primary-rgb: ${rgbValue};
    }

    .chat-export-header {
      margin-bottom: 2em;
      padding-bottom: 1em;
      border-bottom: 2px solid #e5e7eb;
    }

    .chat-export-date {
      margin-top: 0.5em;
      color: #6b7280;
      font-size: 0.9em;
    }

    .chat-bubble-container {
      display: flex;
      align-items: flex-end;
      margin-bottom: 1em;
      page-break-inside: avoid;
    }

    .chat-bubble {
      display: inline-flex;
      max-width: 75%;
      flex-direction: column;
      padding: 10px 16px;
      border-radius: .5rem;
      margin-bottom: 5px;
      box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.08);
      font-size: 0.9em;
      line-height: 1.5;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .chat-bubble-assistant {
      border-radius: .5rem .5rem .5rem 0;
      margin-left: 0;
      margin-right: auto;
      background: #ffffff;
      color: #141515;
      border: 1px solid #e5e7eb;
    }

    .chat-bubble-user {
      border-radius: .5rem .5rem 0 .5rem;
      margin-left: auto;
      margin-right: 0;
      background: rgb(var(--memori-primary-rgb));
      color: #ffffff;
    }

    .chat-bubble-content {
      margin: 0;
    }

    .chat-bubble-content p {
      margin: 0 0 0.5em 0;
    }

    .chat-bubble-content p:last-child {
      margin-bottom: 0;
    }

    .chat-bubble-content ul,
    .chat-bubble-content ol {
      padding-left: 1.5em;
      margin: 0.5em 0;
    }

    .chat-bubble-content a {
      color: inherit;
      text-decoration: underline;
    }

    .chat-bubble-user .chat-bubble-content a {
      color: #ffffff;
      text-decoration: underline;
    }

    .chat-bubble-assistant .chat-bubble-content a {
      color:rgb(var(--memori-primary-rgb));
      text-decoration: underline;
    }

    .chat-bubble-timestamp {
      margin-top: 0.25em;
      font-size: 0.75em;
      opacity: 0.7;
      text-align: right;
    }

    .chat-bubble-assistant .chat-bubble-timestamp {
      text-align: left;
    }

    .chat-bubble-media {
      margin: 0.5em 0 0 0;
      padding-left: 1.5em;
      list-style-type: disc;
    }

    .chat-bubble-media li {
      margin: 0.25em 0;
    }

    .chat-bubble-content code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 0.2em 0.4em;
      border-radius: .5rem;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }

    .chat-bubble-user .chat-bubble-content code {
      background-color: rgba(255, 255, 255, 0.2);
    }

    .chat-bubble-content pre {
      background-color: rgba(0, 0, 0, 0.05);
      padding: 1em;
      border-radius: .5rem;
      overflow-x: auto;
      margin: 0.5em 0;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .chat-bubble-user .chat-bubble-content pre {
      background-color: rgba(255, 255, 255, 0.15);
      border-color: rgba(255, 255, 255, 0.2);
    }

    .chat-bubble-content pre code {
      background: none;
      padding: 0;
    }

    .chat-bubble-content table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.5em 0;
    }

    .chat-bubble-content table th,
    .chat-bubble-content table td {
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 0.5em;
      text-align: left;
    }

    .chat-bubble-user .chat-bubble-content table th,
    .chat-bubble-user .chat-bubble-content table td {
      border-color: rgba(255, 255, 255, 0.2);
    }

    .chat-bubble-content table th {
      background-color: rgba(0, 0, 0, 0.05);
      font-weight: 600;
    }

    .chat-bubble-user .chat-bubble-content table th {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .chat-bubble-content blockquote {
      margin: 0.5em 0;
      padding-left: 1em;
      border-left: 3px solid rgba(0, 0, 0, 0.2);
      font-style: italic;
    }

    .chat-bubble-user .chat-bubble-content blockquote {
      border-left-color: rgba(255, 255, 255, 0.3);
    }

    .chat-bubble-content img {
      max-width: 100%;
      height: auto;
      border-radius: .5rem;
      margin: 0.5em 0;
    }

    .chat-bubble-content h1,
    .chat-bubble-content h2,
    .chat-bubble-content h3,
    .chat-bubble-content h4,
    .chat-bubble-content h5,
    .chat-bubble-content h6 {
      margin: 0.5em 0 0.25em 0;
      font-weight: 600;
    }

    .chat-bubble-content h1 { font-size: 1.5em; }
    .chat-bubble-content h2 { font-size: 1.3em; }
    .chat-bubble-content h3 { font-size: 1.1em; }
  `;
};

/**
 * Format a single message as a chat bubble HTML
 */
const formatMessageBubble = (
  message: Message,
  language: string = 'en'
): string => {
  const timestamp = message.timestamp
    ? new Intl.DateTimeFormat(language, {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(
        new Date(
          message.timestamp.endsWith('Z')
            ? message.timestamp
            : `${message.timestamp}Z`
        )
      )
    : '';

  // Clean and render message text
  const cleanText = (message.text || '').replace(
    /<document_attachment filename="([^"]+)" type="([^"]+)">([\s\S]*?)<\/document_attachment>/g,
    ''
  );

  // Use renderMsg to convert markdown to HTML (same as ChatBubble does)
  const { text: renderedText } = renderMsg(
    cleanText,
    false, // useMathFormatting
    'Reasoning...', // reasoningText
    false // showReasoning - hide reasoning in PDF
  );

  // For non-user messages, remove output tags but keep the rendered HTML
  const messageText = message.fromUser
    ? renderedText
    : stripOutputTags(renderedText);

  // Format message as chat bubble
  const bubbleClass = message.fromUser
    ? 'chat-bubble chat-bubble-user'
    : 'chat-bubble chat-bubble-assistant';

  let html = `<div class="chat-bubble-container">`;
  html += `<div class="${bubbleClass}">`;

  // Add message text
  if (messageText.trim()) {
    html += `<div class="chat-bubble-content">${messageText}</div>`;
  }

  // Add media attachments if present
  if (message.media && message.media.length > 0) {
    html += `<ul class="chat-bubble-media">`;
    message.media.forEach(media => {
      if (media.title) {
        html += `<li><a href="${media.url || '#'}">${media.title}</a></li>`;
      } else if (media.url) {
        html += `<li><a href="${media.url}">${media.url}</a></li>`;
      }
    });
    html += `</ul>`;
  }

  // Add timestamp
  if (timestamp) {
    html += `<div class="chat-bubble-timestamp">${timestamp}</div>`;
  }

  html += `</div>`;
  html += `</div>`;

  return html;
};

/**
 * Format chat history header
 */
const formatChatHeader = (
  memoriName: string,
  exportDate: string,
  conversationStartedLabel: string
): string => {
  return `
    <div class="chat-export-header">
      <h1>${memoriName} - Chat Export</h1>
      <p class="chat-export-date">
        <strong>${conversationStartedLabel}</strong>: ${exportDate}
      </p>
    </div>
  `;
};

/**
 * Format chat history into HTML for PDF export
 */
export const formatChatHistoryForPDF = (
  params: ChatPDFExportParams
): string => {
  const { messages, memori, conversationStartedLabel, language = 'en' } =
    params;

  if (!messages || messages.length === 0) {
    return '';
  }

  const memoriName = memori?.name || 'Assistant';
  const exportDate = new Intl.DateTimeFormat(language, {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  // Build HTML
  let html = formatChatHeader(memoriName, exportDate, conversationStartedLabel);

  // Add each message as a bubble
  messages.forEach(message => {
    html += formatMessageBubble(message, language);
  });

  return html;
};

/**
 * Create the complete HTML document for PDF export
 */
export const createChatPDFDocument = (
  htmlContent: string,
  title: string,
  options: ChatPDFOptions = {}
): string => {
  const css = generateChatPDFCSS(options);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      ${css}
    </head>
    <body>
      <div class="content">
        ${htmlContent}
      </div>
    </body>
    </html>
  `;
};
