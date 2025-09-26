// ArtifactSystem.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactProvider } from './context/ArtifactContext';
import ArtifactHandler from './components/ArtifactHandler/ArtifactHandler';
import ArtifactDrawer from './components/ArtifactDrawer/ArtifactDrawer';
import Chat from '../Chat/Chat';
import {
  Message,
  Memori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import { sanitizeText } from '../../helpers/sanitizer';

// Mock data for Chat component
const mockMemori: Memori = {
  memoriID: 'test-memori-id',
  name: 'Test Memori',
  culture: 'en-US',
  coverURL: '',
  enableBoardOfExperts: false,
} as Memori;

const mockTenant: Tenant = {
  name: 'test-tenant',
} as Tenant;

// Mock functions for Chat component
const mockPushMessage = (message: Message) => {
  console.log('Push message:', message);
};

const mockSimulateUserPrompt = (text: string, translatedText?: string) => {
  console.log('Simulate user prompt:', text, translatedText);
};

const mockOnChangeUserMessage = (userMessage: string) => {
  console.log('Change user message:', userMessage);
};

const mockSendMessage = (msg: string, media?: any[]) => {
  console.log('Send message:', msg, media);
};

const mockSetEnableFocusChatInput = (enableFocusChatInput: boolean) => {
  console.log('Set enable focus chat input:', enableFocusChatInput);
};

const mockStopAudio = () => {
  console.log('Stop audio');
};

const mockStartListening = () => {
  console.log('Start listening');
};

const mockStopListening = () => {
  console.log('Stop listening');
};

const mockSetSendOnEnter = (sendOnEnter: 'keypress' | 'click') => {
  console.log('Set send on enter:', sendOnEnter);
};

const mockSetAttachmentsMenuOpen = (attachmentsMenuOpen: 'link' | 'media') => {
  console.log('Set attachments menu open:', attachmentsMenuOpen);
};

// Story decorator to provide context
const withArtifactProvider = (Story: any) => (
  <ArtifactProvider>
    <Story />
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
const htmlArtifact = `<think>L'utente mi chiede di generare una semplice pagina HTML. Userò il sistema Artifact per creare una pagina HTML pulita e semplice, seguendo le linee guida fornite.

Devo:
1. Usare il formato corretto: <output class="memori-artifact" data-mimetype="html">
2. Creare una pagina HTML completa con DOCTYPE
3. Il tag </output> deve essere DOPO </html>
4. Mantenerla semplice come richiesto
5. Includere un po' di stile per renderla gradevole ma non eccessiva</think>Ciao! Ti creo subito una pagina HTML semplice e pulita:

<output class="memori-artifact" data-mimetype="html">
<!DOCTYPE html>
<html lang="it">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>La mia pagina semplice</title>
 <style>
 body {
 font-family: Arial, sans-serif;
 max-width: 800px;
 margin: 0 auto;
 padding: 20px;
 line-height: 1.6;
 background-color: #f4f4f4;
 }
 
 .container {
 background: white;
 padding: 30px;
 border-radius: 8px;
 box-shadow: 0 2px 10px rgba(0,0,0,0.1);
 }
 
 h1 {
 color: #333;
 text-align: center;
 }
 
 p {
 color: #666;
 margin-bottom: 15px;
 }
 
 .highlight {
 background-color: #e8f5e8;
 padding: 15px;
 border-left: 4px solid #4CAF50;
 margin: 20px 0;
 }
 </style>
</head>
<body>
 <div class="container">
 <h1>Benvenuto nella mia pagina!</h1>
 
 <p>Questa è una pagina HTML semplice e pulita.</p>
 
 <p>Contiene alcuni elementi di base:</p>
 
 <ul>
 <li>Un titolo principale</li>
 <li>Paragrafi di testo</li>
 <li>Una lista</li>
 <li>Un po' di stile CSS</li>
 </ul>
 
 <div class="highlight">
 <strong>Nota:</strong> Puoi modificare liberamente questo codice per personalizzare la tua pagina!
 </div>
 
 <p>Grazie per aver visitato la pagina! 😊</p>
 </div>
</body>
</html>
</output>

Ecco una pagina HTML semplice con:
- Struttura pulita e ben organizzata
- CSS inline per uno styling leggero
- Layout responsive centrato
- Elementi di base: titoli, paragrafi, lista
- Un tocco di colore con la sezione evidenziata

Puoi vedere l'anteprima nel drawer che si è aperto e modificare il codice come preferisci!`;

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
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a complete HTML page for your landing page:

${htmlArtifact}

This page includes modern styling and an interactive button. You can customize the colors and layout as needed.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
        {
          text: 'Try the sanitizeText function',
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
        {
          text: sanitizeText(htmlArtifact),
          fromUser: false,
          timestamp: new Date().toISOString(),
        }
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={true}
      showReasoning={true}
    />
  ),
};

export const MarkdownDocumentation: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `I've created comprehensive project documentation for you:

${markdownArtifact}

This includes all the essential sections for a project README with proper formatting and structure.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const CSSStyles: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `I've created modern CSS styles for your project:

${cssArtifact}

This includes responsive grid layouts, smooth animations, and contemporary styling.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const JavaScriptApp: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `I've built a complete Todo List application in JavaScript:

${javascriptArtifact}

This includes full CRUD functionality with a clean class-based architecture.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const JSONConfiguration: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a complete package.json configuration for your API project:

${jsonArtifact}

This includes all necessary dependencies, scripts, and metadata for a production-ready Node.js API.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const MultipleArtifacts: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `I'll create both the HTML structure and CSS styling for your dashboard:

${htmlArtifact}

${cssArtifact}

This combination gives you a complete, styled web page ready for deployment.`,
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const ConversationFlow: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: 'Can you create a simple HTML page for me?',
          fromUser: true,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          text: `Of course! Here's a complete HTML page with modern styling:

${htmlArtifact}

Would you like me to modify anything about the design or add more functionality?`,
          fromUser: false,
          timestamp: new Date(Date.now() - 240000).toISOString(),
        },
        {
          text: 'Now can you create the CSS to make it look more modern?',
          fromUser: true,
          timestamp: new Date(Date.now() - 180000).toISOString(),
        },
        {
          text: `Here's enhanced CSS with modern design patterns:

${cssArtifact}

This adds responsive grid layouts, smooth animations, and contemporary styling.`,
          fromUser: false,
          timestamp: new Date(Date.now() - 120000).toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};

export const NoArtifacts: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: 'Hello! How can I help you today?',
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
        {
          text: 'I need help with my project planning',
          fromUser: true,
          timestamp: new Date().toISOString(),
        },
        {
          text: "I'd be happy to help with project planning! What type of project are you working on? Are you looking for help with timeline management, resource allocation, task breakdown, or something else?",
          fromUser: false,
          timestamp: new Date().toISOString(),
        },
      ]}
      pushMessage={mockPushMessage}
      simulateUserPrompt={mockSimulateUserPrompt}
      onChangeUserMessage={mockOnChangeUserMessage}
      sendMessage={mockSendMessage}
      setEnableFocusChatInput={mockSetEnableFocusChatInput}
      stopAudio={mockStopAudio}
      startListening={mockStartListening}
      stopListening={mockStopListening}
      setSendOnEnter={mockSetSendOnEnter}
      setAttachmentsMenuOpen={mockSetAttachmentsMenuOpen}
      showInputs={false}
      isChatlogPanel={false}
    />
  ),
};
