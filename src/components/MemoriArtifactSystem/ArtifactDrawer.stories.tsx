// ArtifactSystem.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactProvider } from './context/ArtifactContext';
import ArtifactHandler from './components/ArtifactHandler/ArtifactHandler';
import ArtifactDrawer from './components/ArtifactDrawer/ArtifactDrawer';

// Mock chat component for testing
const MockChat = ({ messages, isChatlogPanel }: { messages: any[], isChatlogPanel?: boolean }) => (
  <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '400px' }}>
    {messages.map((message, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <div style={{ 
          background: message.fromUser ? '#007bff' : '#fff', 
          color: message.fromUser ? '#fff' : '#000',
          padding: '12px',
          borderRadius: '12px',
          marginBottom: '8px'
        }}>
          {message.text}
        </div>
        <ArtifactHandler message={message} isChatlogPanel={isChatlogPanel} />
      </div>
    ))}
  </div>
);

// Story decorator to provide context
const withArtifactProvider = (Story: any) => (
  <ArtifactProvider>
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <Story />
      <ArtifactDrawer />
    </div>
  </ArtifactProvider>
);

const meta: Meta<typeof ArtifactHandler> = {
  title: 'Artifact System',
  component: ArtifactHandler,
  decorators: [withArtifactProvider],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample artifacts for different mime types
const htmlArtifact = `<output class="memori-artifact" data-mimetype="html">
<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .header { color: #333; border-bottom: 2px solid #007bff; }
        .content { margin-top: 20px; }
        .button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h1 class="header">Welcome to My Page</h1>
    <div class="content">
        <p>This is a sample HTML page created as an artifact.</p>
        <button class="button" onclick="alert('Hello!')">Click me</button>
    </div>
</body>
</html>
</output>`;

const markdownArtifact = `<output class="memori-artifact" data-mimetype="markdown">
# Project Documentation

## Overview
This is a comprehensive guide for the project.

## Features
- **Easy to use**: Simple interface
- **Fast**: Optimized performance
- **Reliable**: Well tested

## Getting Started
1. Install dependencies
2. Run the application
3. Open your browser

## Code Example
\`\`\`javascript
function hello() {
    console.log("Hello World!");
}
\`\`\`

## Conclusion
This project helps you build amazing applications.
</output>`;

const cssArtifact = `<output class="memori-artifact" data-mimetype="css">
/* Modern CSS Grid Layout */
.container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

.card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

.card h3 {
    margin-top: 0;
    font-size: 1.5em;
}

.card p {
    line-height: 1.6;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
        padding: 10px;
    }
}
</output>`;

const javascriptArtifact = `<output class="memori-artifact" data-mimetype="javascript">
// Interactive Todo List Application
class TodoApp {
    constructor() {
        this.todos = [];
        this.init();
    }

    init() {
        this.createHTML();
        this.bindEvents();
    }

    createHTML() {
        const app = document.getElementById('app');
        app.innerHTML = \`
            <div class="todo-app">
                <h1>My Todo List</h1>
                <div class="input-section">
                    <input type="text" id="todoInput" placeholder="Add a new todo...">
                    <button id="addBtn">Add</button>
                </div>
                <ul id="todoList"></ul>
            </div>
        \`;
    }

    bindEvents() {
        document.getElementById('addBtn').addEventListener('click', () => this.addTodo());
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();
        
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false
            };
            
            this.todos.push(todo);
            this.renderTodos();
            input.value = '';
        }
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.renderTodos();
    }

    renderTodos() {
        const list = document.getElementById('todoList');
        list.innerHTML = this.todos.map(todo => \`
            <li class="todo-item \${todo.completed ? 'completed' : ''}">
                <span onclick="app.toggleTodo(\${todo.id})">\${todo.text}</span>
                <button onclick="app.deleteTodo(\${todo.id})">Delete</button>
            </li>
        \`).join('');
    }
}

// Initialize the app
const app = new TodoApp();
</output>`;

const jsonArtifact = `<output class="memori-artifact" data-mimetype="json">
{
  "name": "user-profile-api",
  "version": "1.0.0",
  "description": "REST API for user profile management",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^6.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.5.1",
    "cors": "^2.8.5",
    "helmet": "^5.0.0",
    "morgan": "^1.10.0",
    "express-rate-limit": "^6.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.15",
    "jest": "^27.5.1",
    "supertest": "^6.2.2"
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/example/user-profile-api.git"
  },
  "keywords": ["api", "express", "mongodb", "authentication", "rest"],
  "author": "Your Name",
  "license": "MIT"
}
</output>`;

// Stories
export const HTMLArtifact: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `Here's a complete HTML page for your landing page:

${htmlArtifact}

This page includes modern styling and an interactive button. You can customize the colors and layout as needed.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const MarkdownDocumentation: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `I've created comprehensive project documentation for you:

${markdownArtifact}

This includes all the essential sections for a project README with proper formatting and structure.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const CSSStyles: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `Here's a modern CSS grid layout with hover effects:

${cssArtifact}

This creates responsive cards with beautiful gradients and smooth animations.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const JavaScriptApp: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `I've built a complete Todo List application in JavaScript:

${javascriptArtifact}

This includes full CRUD functionality with a clean class-based architecture.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const JSONConfiguration: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `Here's a complete package.json configuration for your API project:

${jsonArtifact}

This includes all necessary dependencies, scripts, and metadata for a production-ready Node.js API.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};
export const MultipleArtifacts: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `I'll create both the HTML structure and CSS styling for your dashboard:

${htmlArtifact}

${cssArtifact}

This combination gives you a complete, styled web page ready for deployment.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const ConversationFlow: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: "Can you create a simple HTML page for me?",
          fromUser: true,
          timestamp: new Date(Date.now() - 300000).toISOString()
        },
        { 
          text: `Of course! Here's a complete HTML page with modern styling:

${htmlArtifact}

Would you like me to modify anything about the design or add more functionality?`,
          fromUser: false,
          timestamp: new Date(Date.now() - 240000).toISOString()
        },
        { 
          text: "Now can you create the CSS to make it look more modern?",
          fromUser: true,
          timestamp: new Date(Date.now() - 180000).toISOString()
        },
        { 
          text: `Here's enhanced CSS with modern design patterns:

${cssArtifact}

This adds responsive grid layouts, smooth animations, and contemporary styling.`,
          fromUser: false,
          timestamp: new Date(Date.now() - 120000).toISOString()
        }
      ]} 
    />
  ),
};

export const NoArtifacts: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: "Hello! How can I help you today?",
          fromUser: false,
          timestamp: new Date().toISOString()
        },
        { 
          text: "I need help with my project planning",
          fromUser: true,
          timestamp: new Date().toISOString()
        },
        { 
          text: "I'd be happy to help with project planning! What type of project are you working on? Are you looking for help with timeline management, resource allocation, task breakdown, or something else?",
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const ChatLogPanelArtifact: Story = {
  args: {},
  render: () => (
    <MockChat
        isChatlogPanel={true}
      messages={[
        { 
          text: `Here's some code that has issues:
${htmlArtifact}`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

export const InvalidArtifact: Story = {
  args: {},
  render: () => (
    <MockChat 
      messages={[
        { 
          text: `Here's some code that has issues:

<output class="memori-artifact" data-mimetype="html">
<h1>Broken HTML
<p>Missing closing tags
</output>

This artifact is too short and has invalid HTML, so it won't be displayed as an artifact.`,
          fromUser: false,
          timestamp: new Date().toISOString()
        }
      ]} 
    />
  ),
};

// CSS for the storybook stories
const styles = `
<style>
.artifact-handlers {
  margin: 10px 0;
}

.artifact-handler {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 8px 0;
}

.artifact-handler:hover {
  background: #f8f9fa;
  border-color: #007bff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0,123,255,0.15);
}

.artifact-handler-icon {
  font-size: 24px;
  margin-right: 12px;
}

.artifact-handler-info {
  flex: 1;
}

.artifact-handler-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.artifact-handler-meta {
  font-size: 12px;
  color: #666;
}

.artifact-handler-action {
  font-size: 18px;
  color: #007bff;
}

.artifact-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 50%;
  height: 100vh;
  background: white;
  border-left: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.artifact-drawer.fullscreen {
  width: 100%;
  left: 0;
}

.artifact-drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
}

.artifact-drawer-header h3 {
  margin: 0;
  color: #333;
}

.artifact-drawer-actions button {
  background: none;
  border: 1px solid #ddd;
  padding: 8px;
  margin-left: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.artifact-drawer-actions button:hover {
  background: #e9ecef;
}

.artifact-drawer-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #ddd;
}

.artifact-drawer-tabs button {
  padding: 12px 24px;
  background: none;
  border: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.artifact-drawer-tabs button.active {
  border-bottom-color: #007bff;
  color: #007bff;
}

.artifact-drawer-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
}

.artifact-code {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  overflow-x: auto;
}

.artifact-preview {
  height: 100%;
}

.artifact-preview iframe {
  width: 100%;
  height: 500px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .artifact-drawer {
    width: 100%;
    left: 0;
  }
}
</style>`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles.replace(/<\/?style>/g, '');
  document.head.appendChild(styleElement);
}