/**
 * Syntax Highlighter Utility
 * 
 * This utility provides syntax highlighting functionality for different programming languages,
 * following the patterns established in memori-react.
 */

import { ArtifactMimeType } from '../types/artifact.types';

/**
 * Language mapping for syntax highlighting
 */
export const LANGUAGE_MAPPING: Record<ArtifactMimeType, string> = {
  html: 'html',
  json: 'json',
  markdown: 'markdown',
  css: 'css',
  javascript: 'javascript',
  typescript: 'typescript',
  svg: 'xml',
  xml: 'xml',
  text: 'text',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  rust: 'rust',
  yaml: 'yaml',
  sql: 'sql'
};

/**
 * Simple syntax highlighter that works without external dependencies
 * This provides basic highlighting for common languages
 */
export class SimpleSyntaxHighlighter {
  private static readonly KEYWORDS = {
    javascript: [
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this',
      'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'static',
      'public', 'private', 'protected', 'interface', 'type', 'enum', 'namespace'
    ],
    typescript: [
      'function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'do', 'switch', 'case',
      'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw', 'new', 'this',
      'class', 'extends', 'import', 'export', 'default', 'async', 'await', 'static',
      'public', 'private', 'protected', 'interface', 'type', 'enum', 'namespace',
      'string', 'number', 'boolean', 'any', 'void', 'null', 'undefined', 'object',
      'Array', 'Promise', 'Date', 'RegExp', 'Error'
    ],
    python: [
      'def', 'class', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'finally',
      'with', 'as', 'import', 'from', 'return', 'yield', 'lambda', 'and', 'or', 'not',
      'in', 'is', 'True', 'False', 'None', 'self', 'super', 'global', 'nonlocal',
      'pass', 'break', 'continue', 'raise', 'assert', 'del'
    ],
    java: [
      'public', 'private', 'protected', 'static', 'final', 'abstract', 'class', 'interface',
      'extends', 'implements', 'import', 'package', 'if', 'else', 'for', 'while', 'do',
      'switch', 'case', 'break', 'continue', 'return', 'try', 'catch', 'finally', 'throw',
      'new', 'this', 'super', 'void', 'int', 'long', 'float', 'double', 'boolean', 'char',
      'String', 'Object', 'null', 'true', 'false'
    ],
    css: [
      'color', 'background', 'border', 'margin', 'padding', 'width', 'height', 'display',
      'position', 'top', 'right', 'bottom', 'left', 'z-index', 'float', 'clear',
      'font-family', 'font-size', 'font-weight', 'text-align', 'text-decoration',
      'line-height', 'letter-spacing', 'word-spacing', 'white-space', 'overflow',
      'visibility', 'opacity', 'transform', 'transition', 'animation', 'flex', 'grid'
    ],
    sql: [
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
      'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA', 'JOIN', 'INNER', 'LEFT', 'RIGHT',
      'OUTER', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET',
      'UNION', 'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AND', 'OR', 'NOT',
      'IN', 'EXISTS', 'BETWEEN', 'LIKE', 'IS', 'NULL'
    ]
  };

  private static readonly OPERATORS = [
    '+', '-', '*', '/', '%', '=', '==', '===', '!=', '!==', '<', '>', '<=', '>=',
    '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '>>>', '?', ':', '=>', '...'
  ];

  private static readonly STRING_DELIMITERS = ['"', "'", '`'];

  /**
   * Highlight syntax for a given language
   */
  static highlight(code: string, language: string): string {
    const lang = language.toLowerCase();
    
    switch (lang) {
      case 'javascript':
      case 'typescript':
        return this.highlightJavaScript(code, lang);
      case 'python':
        return this.highlightPython(code);
      case 'java':
        return this.highlightJava(code);
      case 'css':
        return this.highlightCSS(code);
      case 'html':
        return this.highlightHTML(code);
      case 'json':
        return this.highlightJSON(code);
      case 'sql':
        return this.highlightSQL(code);
      case 'xml':
      case 'svg':
        return this.highlightXML(code);
      case 'markdown':
        return this.highlightMarkdown(code);
      default:
        return this.highlightGeneric(code);
    }
  }

  /**
   * Highlight JavaScript/TypeScript code
   */
  private static highlightJavaScript(code: string, lang: string): string {
    const keywords = this.KEYWORDS[lang as keyof typeof this.KEYWORDS] || this.KEYWORDS.javascript;
    
    return code
      .replace(/(\/\/.*$)/gm, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="memori-artifact--keyword">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>')
      .replace(new RegExp(`([${this.OPERATORS.map(op => op.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}])`, 'g'), '<span class="memori-artifact--operator">$1</span>')
      .replace(/\b(function|class|interface|type|enum)\s+(\w+)/g, '<span class="memori-artifact--keyword">$1</span> <span class="memori-artifact--function">$2</span>');
  }

  /**
   * Highlight Python code
   */
  private static highlightPython(code: string): string {
    const keywords = this.KEYWORDS.python;
    
    return code
      .replace(/(#.*$)/gm, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="memori-artifact--keyword">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>')
      .replace(/\b(def|class)\s+(\w+)/g, '<span class="memori-artifact--keyword">$1</span> <span class="memori-artifact--function">$2</span>');
  }

  /**
   * Highlight Java code
   */
  private static highlightJava(code: string): string {
    const keywords = this.KEYWORDS.java;
    
    return code
      .replace(/(\/\/.*$)/gm, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="memori-artifact--keyword">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>')
      .replace(/\b(public|private|protected|static|final|abstract)\s+(class|interface)\s+(\w+)/g, '<span class="memori-artifact--keyword">$1</span> <span class="memori-artifact--keyword">$2</span> <span class="memori-artifact--function">$3</span>');
  }

  /**
   * Highlight CSS code
   */
  private static highlightCSS(code: string): string {
    const keywords = this.KEYWORDS.css;
    
    return code
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'g'), '<span class="memori-artifact--property">$1</span>')
      .replace(/([.#]?\w+)\s*\{/g, '<span class="memori-artifact--selector">$1</span> {')
      .replace(/(\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch|vmin|vmax|deg|rad|grad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx))/g, '<span class="memori-artifact--number">$1</span>');
  }

  /**
   * Highlight HTML code
   */
  private static highlightHTML(code: string): string {
    return code
      .replace(/(<!--[\s\S]*?-->)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(<[^>]+>)/g, '<span class="memori-artifact--tag">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>');
  }

  /**
   * Highlight JSON code
   */
  private static highlightJSON(code: string): string {
    return code
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="memori-artifact--keyword">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>');
  }

  /**
   * Highlight SQL code
   */
  private static highlightSQL(code: string): string {
    const keywords = this.KEYWORDS.sql;
    
    return code
      .replace(/(--.*$)/gm, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi'), '<span class="memori-artifact--keyword">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>');
  }

  /**
   * Highlight XML/SVG code
   */
  private static highlightXML(code: string): string {
    return code
      .replace(/(<!--[\s\S]*?-->)/g, '<span class="memori-artifact--comment">$1</span>')
      .replace(/(<[^>]+>)/g, '<span class="memori-artifact--tag">$1</span>')
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>');
  }

  /**
   * Highlight Markdown code
   */
  private static highlightMarkdown(code: string): string {
    return code
      .replace(/^(#{1,6})\s+(.+)$/gm, '<span class="memori-artifact--heading">$1 $2</span>')
      .replace(/\*\*(.+?)\*\*/g, '<span class="memori-artifact--bold">$1</span>')
      .replace(/\*(.+?)\*/g, '<span class="memori-artifact--italic">$1</span>')
      .replace(/`(.+?)`/g, '<span class="memori-artifact--code">$1</span>')
      .replace(/```[\s\S]*?```/g, '<span class="memori-artifact--code-block">$&</span>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<span class="memori-artifact--link">$1</span>');
  }

  /**
   * Generic highlighting for unknown languages
   */
  private static highlightGeneric(code: string): string {
    return code
      .replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="memori-artifact--string">$1$2$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="memori-artifact--number">$1</span>');
  }
}

/**
 * Get the appropriate language for syntax highlighting
 */
export function getHighlightLanguage(mimeType: ArtifactMimeType): string {
  return LANGUAGE_MAPPING[mimeType] || 'text';
}

/**
 * Check if syntax highlighting is supported for a given MIME type
 */
export function isSyntaxHighlightingSupported(mimeType: ArtifactMimeType): boolean {
  return mimeType !== 'text' && LANGUAGE_MAPPING[mimeType] !== undefined;
}

/**
 * Format code with line numbers
 */
export function formatCodeWithLineNumbers(code: string, startLine: number = 1): string {
  const lines = code.split('\n');
  const maxLineNumber = startLine + lines.length - 1;
  const lineNumberWidth = maxLineNumber.toString().length;
  
  return lines
    .map((line, index) => {
      const lineNumber = (startLine + index).toString().padStart(lineNumberWidth, ' ');
      return `<span class="memori-artifact--line-number">${lineNumber}</span>${line}`;
    })
    .join('\n');
}

/**
 * Escape HTML characters in code
 */
export function escapeHtml(code: string): string {
  return code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Highlight code with proper escaping and formatting
 */
export function highlightCode(
  code: string, 
  mimeType: ArtifactMimeType, 
  options: {
    showLineNumbers?: boolean;
    startLine?: number;
    enableHighlighting?: boolean;
  } = {}
): string {
  const {
    showLineNumbers = false,
    startLine = 1,
    enableHighlighting = true
  } = options;
  
  let highlightedCode = escapeHtml(code);
  
  if (enableHighlighting && isSyntaxHighlightingSupported(mimeType)) {
    const language = getHighlightLanguage(mimeType);
    highlightedCode = SimpleSyntaxHighlighter.highlight(highlightedCode, language);
  }
  
  if (showLineNumbers) {
    highlightedCode = formatCodeWithLineNumbers(highlightedCode, startLine);
  }
  
  return highlightedCode;
}
