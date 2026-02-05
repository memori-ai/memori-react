// ArtifactSystem.stories.tsx
import React, { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactProvider, useArtifact } from './context/ArtifactContext';
import ArtifactHandler from './components/ArtifactHandler/ArtifactHandler';
import ArtifactDrawer from './components/ArtifactDrawer/ArtifactDrawer';
import { ArtifactAPIBridge } from './utils/ArtifactAPI';
import Chat from '../Chat/Chat';
import {
  Message,
  Memori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import { sanitizeText } from '../../helpers/sanitizer';
import { ArtifactData } from './types/artifact.types';

// Note: Window.MemoriArtifactAPI types are defined in MemoriWidget.tsx

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
    <ArtifactAPIBridge pushMessage={mockPushMessage} />
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
</think>
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
 border-radius: .5rem;
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

const htmlArtifactWithScrolling = `<output class="memori-artifact" data-mimetype="html">
<!DOCTYPE html>
<html lang="it">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Memori & AIsuru</title>
 <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@100;300;400;500;600;900&display=swap" rel="stylesheet">
 <style>
 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
 }
 
 :root {
 /* Brand Colors dalla palette */
 --color-light-teal: #9CDCD9; /* PMS 324 C */
 --color-bright-cyan: #00AEC7; /* PMS 3125 C */
 --color-purple: #8246AF; /* PMS 2587 C */
 --color-dark-purple: #653165; /* PMS 2622 C */
 --color-navy: #005587; /* PMS 7692 C */
 
 /* Typography - Lexend Variable */
 --font-family: 'Lexend', sans-serif;
 }
 
 body {
 font-family: var(--font-family);
 font-weight: 400;
 line-height: 1.6;
 color: #333;
 overflow-x: hidden;
 }
 
 /* Hero Section con gradiente brand */
 .hero {
 background: linear-gradient(135deg, var(--color-bright-cyan) 0%, var(--color-purple) 50%, var(--color-dark-purple) 100%);
 min-height: 100vh;
 display: flex;
 align-items: center;
 justify-content: center;
 text-align: center;
 color: white;
 position: relative;
 overflow: hidden;
 }
 
 .hero::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: radial-gradient(circle at 30% 20%, rgba(156, 220, 217, 0.3) 0%, transparent 50%),
 radial-gradient(circle at 80% 80%, rgba(130, 70, 175, 0.3) 0%, transparent 50%);
 }
 
 .hero-content {
 position: relative;
 z-index: 1;
 max-width: 800px;
 padding: 2rem;
 }
 
 .brand-title {
 font-size: clamp(3rem, 10vw, 6rem);
 font-weight: 900; /* Black weight come da brandbook */
 margin-bottom: 1rem;
 text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3);
 animation: fadeInUp 1s ease-out;
 }
 
 .brand-subtitle {
 font-size: clamp(1.2rem, 4vw, 2rem);
 font-weight: 300; /* Light weight */
 margin-bottom: 2rem;
 opacity: 0.95;
 animation: fadeInUp 1s ease-out 0.3s both;
 }
 
 .cta-button {
 display: inline-block;
 padding: 1.2rem 2.5rem;
 background: var(--color-light-teal);
 color: var(--color-navy);
 text-decoration: none;
 border-radius: .5rem;
 font-weight: 600; /* Semibold */
 font-size: 1.1rem;
 transition: all 0.3s ease;
 animation: fadeInUp 1s ease-out 0.6s both;
 text-transform: uppercase;
 letter-spacing: 0.5px;
 }
 
 .cta-button:hover {
 background: white;
 transform: translateY(-3px);
 box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
 }
 
 /* Features Section con colori del brand */
 .features {
 padding: 5rem 2rem;
 background: linear-gradient(45deg, rgba(156, 220, 217, 0.1) 0%, rgba(0, 174, 199, 0.1) 100%);
 }
 
 .container {
 max-width: 1200px;
 margin: 0 auto;
 }
 
 .section-title {
 text-align: center;
 font-size: 3rem;
 font-weight: 900;
 margin-bottom: 3rem;
 color: var(--color-navy);
 }
 
 .features-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
 gap: 2.5rem;
 }
 
 .feature-card {
 background: white;
 padding: 2.5rem;
 border-radius: .5rem;
 box-shadow: 0 10px 40px rgba(0, 85, 135, 0.1);
 text-align: center;
 transition: all 0.3s ease;
 border: 1px solid rgba(0, 174, 199, 0.1);
 position: relative;
 overflow: hidden;
 }
 
 .feature-card::before {
 content: '';
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 height: 4px;
 background: linear-gradient(90deg, var(--color-bright-cyan), var(--color-purple));
 }
 
 .feature-card:hover {
 transform: translateY(-10px);
 box-shadow: 0 25px 60px rgba(0, 85, 135, 0.2);
 }
 
 .feature-icon {
 font-size: 4rem;
 margin-bottom: 1.5rem;
 background: linear-gradient(135deg, var(--color-bright-cyan), var(--color-purple));
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
 font-weight: 900;
 }
 
 .feature-card h3 {
 font-size: 1.5rem;
 font-weight: 600;
 margin-bottom: 1rem;
 color: var(--color-navy);
 }
 
 .feature-card p {
 color: #666;
 line-height: 1.8;
 font-weight: 400;
 }
 
 /* Brand Colors Section */
 .brand-colors {
 padding: 5rem 2rem;
 background: var(--color-navy);
 color: white;
 }
 
 .colors-grid {
 display: grid;
 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
 gap: 2rem;
 margin-top: 3rem;
 }
 
 .color-swatch {
 text-align: center;
 padding: 1.5rem;
 border-radius: .5rem;
 background: rgba(255, 255, 255, 0.1);
 backdrop-filter: blur(10px);
 }
 
 .color-circle {
 width: 100px;
 height: 100px;
 border-radius: 50%;
 margin: 0 auto 1rem;
 border: 3px solid rgba(255, 255, 255, 0.3);
 }
 
 .color-1 { background: var(--color-light-teal); }
 .color-2 { background: var(--color-bright-cyan); }
 .color-3 { background: var(--color-purple); }
 .color-4 { background: var(--color-dark-purple); }
 .color-5 { background: var(--color-navy); }
 
 .color-name {
 font-weight: 600;
 margin-bottom: 0.5rem;
 }
 
 .color-hex {
 font-family: 'Courier New', monospace;
 font-size: 0.9rem;
 opacity: 0.8;
 }
 
 /* Typography Section */
 .typography {
 padding: 5rem 2rem;
 background: linear-gradient(135deg, rgba(130, 70, 175, 0.05), rgba(101, 49, 101, 0.05));
 }
 
 .type-example {
 margin: 2rem 0;
 padding: 2rem;
 background: white;
 border-radius: .5rem;
 box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
 }
 
 .lexend-thin { font-weight: 100; font-size: 2rem; color: var(--color-purple); }
 .lexend-light { font-weight: 300; font-size: 1.8rem; color: var(--color-bright-cyan); }
 .lexend-regular { font-weight: 400; font-size: 1.5rem; color: var(--color-navy); }
 .lexend-medium { font-weight: 500; font-size: 1.3rem; color: var(--color-dark-purple); }
 .lexend-semibold { font-weight: 600; font-size: 1.2rem; color: var(--color-purple); }
 .lexend-black { font-weight: 900; font-size: 2.5rem; color: var(--color-navy); }
 
 /* Footer */
 footer {
 background: var(--color-dark-purple);
 color: white;
 text-align: center;
 padding: 3rem 2rem;
 }
 
 .footer-content {
 max-width: 800px;
 margin: 0 auto;
 }
 
 .footer-title {
 font-size: 2rem;
 font-weight: 900;
 margin-bottom: 1rem;
 background: linear-gradient(135deg, var(--color-light-teal), var(--color-bright-cyan));
 -webkit-background-clip: text;
 -webkit-text-fill-color: transparent;
 background-clip: text;
 }
 
 /* Animations */
 @keyframes fadeInUp {
 from {
 opacity: 0;
 transform: translateY(30px);
 }
 to {
 opacity: 1;
 transform: translateY(0);
 }
 }
 
 /* Responsive */
 @media (max-width: 768px) {
 .features-grid {
 grid-template-columns: 1fr;
 }
 
 .colors-grid {
 grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
 }
 }
 </style>
</head>
<body>
 <section class="hero">
 <div class="hero-content">
 <h1 class="brand-title">Memori & AIsuru</h1>
 <p class="brand-subtitle">Dove l'intelligenza artificiale incontra la memoria del futuro</p>
 <a href="#features" class="cta-button">Scopri di più</a>
 </div>
 </section>
 
 <section id="features" class="features">
 <div class="container">
 <h2 class="section-title">Caratteristiche Innovative</h2>
 <div class="features-grid">
 <div class="feature-card">
 <div class="feature-icon">🧠</div>
 <h3>Intelligenza Avanzata</h3>
 <p>Sistema di AI all'avanguardia che apprende e si adatta alle tue esigenze specifiche, offrendo soluzioni personalizzate e intelligenti.</p>
 </div>
 
 <div class="feature-card">
 <div class="feature-icon">💾</div>
 <h3>Memoria Infinita</h3>
 <p>Capacità di archiviazione e recupero dati senza limiti, con algoritmi ottimizzati per prestazioni eccezionali.</p>
 </div>
 
 <div class="feature-card">
 <div class="feature-icon">⚡</div>
 <h3>Velocità Estrema</h3>
 <p>Elaborazione in tempo reale con latenza minimale, garantendo risposte immediate e fluide in ogni situazione.</p>
 </div>
 </div>
 </div>
 </section>
 
 <section class="brand-colors">
 <div class="container">
 <h2 class="section-title">Brand Palette</h2>
 <div class="colors-grid">
 <div class="color-swatch">
 <div class="color-circle color-1"></div>
 <div class="color-name">Light Teal</div>
 <div class="color-hex">#9CDCD9</div>
 </div>
 <div class="color-swatch">
 <div class="color-circle color-2"></div>
 <div class="color-name">Bright Cyan</div>
 <div class="color-hex">#00AEC7</div>
 </div>
 <div class="color-swatch">
 <div class="color-circle color-3"></div>
 <div class="color-name">Purple</div>
 <div class="color-hex">#8246AF</div>
 </div>
 <div class="color-swatch">
 <div class="color-circle color-4"></div>
 <div class="color-name">Dark Purple</div>
 <div class="color-hex">#653165</div>
 </div>
 <div class="color-swatch">
 <div class="color-circle color-5"></div>
 <div class="color-name">Navy</div>
 <div class="color-hex">#005587</div>
 </div>
 </div>
 </div>
 </section>
 
 <section class="typography">
 <div class="container">
 <h2 class="section-title">Tipografia Lexend</h2>
 <div class="type-example">
 <div class="lexend-thin">Lexend Thin - Eleganza e leggerezza</div>
 </div>
 <div class="type-example">
 <div class="lexend-light">Lexend Light - Chiarezza ottimale</div>
 </div>
 <div class="type-example">
 <div class="lexend-regular">Lexend Regular - Testo standard leggibile</div>
 </div>
 <div class="type-example">
 <div class="lexend-medium">Lexend Medium - Enfasi equilibrata</div>
 </div>
 <div class="type-example">
 <div class="lexend-semibold">Lexend Semibold - Importanza marcata</div>
 </div>
 <div class="type-example">
 <div class="lexend-black">Lexend Black - Impatto Massimo</div>
 </div>
 </div>
 </section>
 
 <footer>
 <div class="footer-content">
 <h3 class="footer-title">Memori & AIsuru</h3>
 <p>Innovazione, design e tecnologia in perfetta armonia secondo le linee guida del brand.</p>
 <p style="margin-top: 2rem; opacity: 0.7; font-size: 0.9rem;">
 Rispettando le dimensioni minime (12mm), palette colori PMS, tipografia Lexend e area di rispetto del brandbook.
 </p>
 </div>
 </footer>
</body>
</html>
</output>
`;
const htmlArtifactScrollTest = `<output class="memori-artifact" data-mimetype="html" data-title="Tall Content Scroll Test">
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Scroll Test</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        background: #f0f4f8;
        color: #1f2933;
        line-height: 1.6;
      }

      .hero {
        padding: 32px;
        text-align: center;
        background: linear-gradient(135deg, #2563eb, #7c3aed);
        color: #fff;
      }

      .hero h1 {
        margin: 0 0 12px;
        font-size: 2.5rem;
      }

      .section {
        padding: 32px;
        background: #fff;
        margin: 16px;
        border-radius: .5rem;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      }

      .section h2 {
        margin-top: 0;
        color: #2563eb;
      }

      .cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
        margin-top: 24px;
      }

      .card {
        padding: 16px;
        border-radius: .5rem;
        background: #eef2ff;
        border: 1px solid #c7d2fe;
      }

      footer {
        text-align: center;
        padding: 32px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="hero">
      <h1>Scroll Test Page</h1>
      <p>Before the fix this iframe overflow forced the container to scroll.</p>
    </div>
    ${Array.from({ length: 6 })
      .map(
        (_, idx) => `
    <section class="section">
      <h2>Section ${idx + 1}</h2>
      <p>
        This is tall content block ${idx + 1}. It exists purely to make the page taller than the
        drawer viewport so we can ensure the iframe owns the scrollable area.
      </p>
      <div class="cards">
        <div class="card">
          <strong>Metric A</strong>
          <p>${(idx + 1) * 120} units</p>
        </div>
        <div class="card">
          <strong>Metric B</strong>
          <p>${(idx + 1) * 45}%</p>
        </div>
        <div class="card">
          <strong>Metric C</strong>
          <p>${(idx + 1) * 300} pts</p>
        </div>
      </div>
    </section>`
      )
      .join('')}
    <footer>End of scroll test content</footer>
  </body>
</html>
</output>`;

const svgArtifact = `<output class="memori-artifact" data-mimetype="svg">
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
 <defs>
 <!-- Gradiente per il quadrato -->
 <linearGradient id="squareGradient" x1="0%" y1="0%" x2="100%" y2="100%">
 <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
 <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
 </linearGradient>
 
 <!-- Ombra -->
 <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
 <feDropShadow dx="3" dy="3" stdDeviation="3" flood-opacity="0.3"/>
 </filter>
 
 <!-- Effetto glow -->
 <filter id="glow">
 <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
 <feMerge> 
 <feMergeNode in="coloredBlur"/>
 <feMergeNode in="SourceGraphic"/>
 </feMerge>
 </filter>
 </defs>
 
 <!-- Sfondo -->
 <rect width="200" height="200" fill="#f8f9fa"/>
 
 <!-- Quadrato principale -->
 <rect x="50" y="50" width="100" height="100" 
 fill="url(#squareGradient)" 
 stroke="rgba(255,255,255,0.3)" 
 stroke-width="2"
 rx="8" 
 filter="url(#shadow)"
 opacity="0">
 
 <!-- Animazione fade in -->
 <animate attributeName="opacity" 
 values="0;1" 
 dur="1s" 
 fill="freeze"/>
 
 <!-- Animazione rotazione -->
 <animateTransform 
 attributeName="transform"
 attributeType="XML"
 type="rotate"
 values="0 100 100;5 100 100;-5 100 100;0 100 100"
 dur="3s"
 repeatCount="indefinite"/>
 </rect>
 
 <!-- Quadrato interno decorativo -->
 <rect x="75" y="75" width="50" height="50" 
 fill="rgba(255,255,255,0.2)" 
 rx="4"
 opacity="0">
 
 <animate attributeName="opacity" 
 values="0;0.6;0" 
 dur="2s" 
 repeatCount="indefinite"/>
 </rect>
 
 <!-- Particelle decorative -->
 <circle cx="60" cy="60" r="2" fill="#FFD700" opacity="0">
 <animate attributeName="opacity" values="0;1;0" dur="1.5s" repeatCount="indefinite"/>
 </circle>
 
 <circle cx="140" cy="140" r="1.5" fill="#FF6B6B" opacity="0">
 <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" begin="0.5s"/>
 </circle>
 
 <circle cx="140" cy="60" r="1" fill="#4ECDC4" opacity="0">
 <animate attributeName="opacity" values="0;1;0" dur="1.8s" repeatCount="indefinite" begin="1s"/>
 </circle>
 
 <!-- Testo centrale -->
 <text x="100" y="105" 
 text-anchor="middle" 
 fill="white" 
 font-family="system-ui, sans-serif" 
 font-size="14" 
 font-weight="bold"
 opacity="0">
 SVG
 <animate attributeName="opacity" values="0;1" dur="1.5s" fill="freeze" begin="0.5s"/>
 </text>
</svg>
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
    border-radius: .5rem;
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
      isChatlogPanel={true}
      showReasoning={true}
    />
  ),
};

export const HTMLArtifactWithScrolling: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a complete HTML page for your landing page:

${htmlArtifactWithScrolling}

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
          text: sanitizeText(htmlArtifactWithScrolling),
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
      showReasoning={true}
    />
  ),
};

export const HTMLScrollTest: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a deliberately tall HTML artifact to validate iframe scrolling:

${htmlArtifactScrollTest}

Scroll inside the preview to confirm only the iframe scrolls.`,
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
      showReasoning={false}
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

export const ThreeArtifactsInOneMessage: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `I'll create a complete web component for you with HTML, CSS, and JavaScript:

<output class="memori-artifact" data-mimetype="html" data-title="Dashboard Component">
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard</title>
</head>
<body>
  <div id="dashboard" class="dashboard-container">
    <h1>Sales Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Revenue</h3>
        <p id="revenue">$0</p>
      </div>
      <div class="stat-card">
        <h3>Customers</h3>
        <p id="customers">0</p>
      </div>
      <div class="stat-card">
        <h3>Growth</h3>
        <p id="growth">0%</p>
      </div>
    </div>
  </div>
</body>
</html>
</output>

<output class="memori-artifact" data-mimetype="css" data-title="Dashboard Styles">
/* Dashboard Styles */
.dashboard-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

h1 {
  color: white;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 30px;
}

.stat-card {
  background: white;
  border-radius: .5rem;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
}

.stat-card h3 {
  color: #667eea;
  font-size: 1.2rem;
  margin-bottom: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-card p {
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
}
</output>

<output class="memori-artifact" data-mimetype="javascript" data-title="Dashboard Logic">
// Dashboard Data Management
class Dashboard {
  constructor() {
    this.data = {
      revenue: 0,
      customers: 0,
      growth: 0
    };
    this.init();
  }

  init() {
    // Simulate loading data
    this.loadData();
    
    // Update every 5 seconds
    setInterval(() => this.updateData(), 5000);
  }

  loadData() {
    // Simulate API call
    this.data = {
      revenue: 124500,
      customers: 1234,
      growth: 23.5
    };
    this.render();
  }

  updateData() {
    // Simulate real-time updates
    this.data.revenue += Math.floor(Math.random() * 1000);
    this.data.customers += Math.floor(Math.random() * 10);
    this.data.growth += (Math.random() - 0.5) * 2;
    this.render();
  }

  render() {
    const revenueEl = document.getElementById('revenue');
    const customersEl = document.getElementById('customers');
    const growthEl = document.getElementById('growth');

    if (revenueEl) {
      revenueEl.textContent = '$' + this.data.revenue.toLocaleString();
    }
    
    if (customersEl) {
      customersEl.textContent = this.data.customers.toLocaleString();
    }
    
    if (growthEl) {
      growthEl.textContent = '+' + this.data.growth.toFixed(1) + '%';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
  });
} else {
  new Dashboard();
}
</output>

Each artifact serves a specific purpose:
- **HTML**: The structure and content
- **CSS**: Beautiful styling with gradients and animations
- **JavaScript**: Interactive data management and updates

You can click on each card to view and modify the code!`,
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

export const FiveArtifactsMixedTypes: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a complete project setup with multiple files:

<output class="memori-artifact" data-mimetype="html" data-title="index.html">
<!DOCTYPE html>
<html>
<head>
  <title>My Project</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>
</output>

<output class="memori-artifact" data-mimetype="css" data-title="styles.css">
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: .5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
</output>

<output class="memori-artifact" data-mimetype="javascript" data-title="app.js">
const app = document.getElementById('app');
app.innerHTML = '<h1>Hello World!</h1>';
console.log('App initialized');
</output>

<output class="memori-artifact" data-mimetype="json" data-title="package.json">
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "A simple web project",
  "main": "app.js",
  "scripts": {
    "start": "serve .",
    "build": "webpack"
  },
  "dependencies": {
    "serve": "^14.0.0"
  }
}
</output>

<output class="memori-artifact" data-mimetype="markdown" data-title="README.md">
# My Project

## Overview
A simple web application starter template.

## Getting Started
1. Install dependencies: \`npm install\`
2. Start the server: \`npm start\`
3. Open http://localhost:3000

## Features
- Clean HTML structure
- Modern CSS styling
- JavaScript functionality
- Package management with npm

## License
MIT
</output>

All files are ready! You now have a complete project structure with HTML, CSS, JavaScript, configuration, and documentation.`,
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

export const SVGArtifact: Story = {
  args: {},
  render: () => (
    <Chat
      memori={mockMemori}
      tenant={mockTenant}
      sessionID="test-session"
      history={[
        {
          text: `Here's a complete SVG artifact:

${svgArtifact}

This SVG includes a simple circle with a red fill.`,
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

// ========================================
// ArtifactAPI Bridge Stories
// ========================================

export const APIBridge_CreateSimpleArtifact: Story = {
  args: {},
  render: () => {
    const TestComponent = () => {
      const { state } = useArtifact();

      useEffect(() => {
        // Wait a bit for the API to be available
        setTimeout(() => {
          console.log(
            'MemoriArtifactAPI available:',
            !!window.MemoriArtifactAPI
          );
        }, 100);
      }, []);

      const createHTMLArtifact = () => {
        window.MemoriArtifactAPI?.createAndOpenArtifact(
          '<h1>🎉 Created from API!</h1><p>This artifact was created using <code>window.MemoriArtifactAPI.createAndOpenArtifact()</code></p><p>You can use this API to create artifacts programmatically from any JavaScript code.</p>',
          'html',
          'API Test Artifact'
        );
      };

      const createMarkdownArtifact = () => {
        window.MemoriArtifactAPI?.createAndOpenArtifact(
          `# Artifact Created via API

## This is a test

This artifact was created using the global API:

\`\`\`javascript
window.MemoriArtifactAPI.createAndOpenArtifact(content, 'markdown', 'Title');
\`\`\`

### Features:
- ✅ Programmatic control
- ✅ Multiple MIME types
- ✅ Easy integration`,
          'markdown',
          'API Markdown Example'
        );
      };

      const createJavaScriptArtifact = () => {
        window.MemoriArtifactAPI?.createAndOpenArtifact(
          `// Example function created via API
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome, \${name}\`;
}

// Call it
const message = greet('Developer');
console.log(message);`,
          'javascript',
          'JavaScript via API'
        );
      };

      const checkState = () => {
        const state = window.MemoriArtifactAPI?.getState();
        console.log('Current artifact state:', state);
        alert(JSON.stringify(state, null, 2));
      };

      return (
        <>
          {/* Conditionally render ArtifactDrawer to avoid hooks error */}
          {state.isDrawerOpen && <ArtifactDrawer />}

          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🧪 Artifact API Test Lab</h1>
            <p>
              Test the global <code>window.MemoriArtifactAPI</code> by clicking
              the buttons below. Open the browser console to see the API in
              action.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <button
                onClick={createHTMLArtifact}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                📄 Create HTML Artifact
              </button>

              <button
                onClick={createMarkdownArtifact}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                📝 Create Markdown Artifact
              </button>

              <button
                onClick={createJavaScriptArtifact}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#6d28d9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                💻 Create JavaScript Artifact
              </button>

              <button
                onClick={checkState}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#5b21b6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                📊 Check Current State
              </button>

              <button
                onClick={() => window.MemoriArtifactAPI?.closeArtifact()}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                ❌ Close Artifact
              </button>

              <button
                onClick={() => window.MemoriArtifactAPI?.toggleFullscreen()}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                ⛶ Toggle Fullscreen
              </button>
            </div>

            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
              }}
            >
              <h3>💡 Console Commands</h3>
              <p>Try these in the browser console:</p>
              <pre
                style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                }}
              >
                {`// Create an artifact
window.MemoriArtifactAPI.createAndOpenArtifact(
  '<h1>Test</h1>',
  'html',
  'My Title'
);

// Check state
window.MemoriArtifactAPI.getState();

// Close
window.MemoriArtifactAPI.closeArtifact();`}
              </pre>
            </div>
          </div>
        </>
      );
    };

    return <TestComponent />;
  },
};

export const APIBridge_ProcessOutputElements: Story = {
  args: {},
  render: () => {
    const TestComponent = () => {
      const { state } = useArtifact();

      const createFromOutput = () => {
        const outputs = document.querySelectorAll(
          '.memori-artifact[data-sample="true"]'
        );
        outputs.forEach(output => {
          const artifactId = window.MemoriArtifactAPI?.createFromOutputElement(
            output as HTMLOutputElement
          );
          console.log('Created artifact:', artifactId);
        });
        alert(`Processed ${outputs.length} artifacts. Check console for IDs.`);
      };

      const addDynamicOutput = () => {
        const container = document.getElementById('dynamic-container');
        if (container) {
          const output = document.createElement('output');
          output.className = 'memori-artifact';
          output.setAttribute('data-mimetype', 'html');
          output.setAttribute('data-title', 'Dynamic Artifact');
          output.setAttribute('data-sample', 'true');
          output.innerHTML = `
            <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: .5rem;">
              <h2>🚀 Dynamically Added!</h2>
              <p>This artifact was added to the DOM dynamically and then processed.</p>
              <p>Timestamp: ${new Date().toLocaleTimeString()}</p>
            </div>
          `;
          container.appendChild(output);
        }
      };

      return (
        <>
          {/* Conditionally render ArtifactDrawer to avoid hooks error */}
          {state.isDrawerOpen && <ArtifactDrawer />}

          <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>🔄 Process Output Elements</h1>
            <p>
              This story demonstrates processing{' '}
              <code>&lt;output class=&quot;memori-artifact&quot;&gt;</code>{' '}
              elements using <code>createFromOutputElement</code>.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '20px',
              }}
            >
              <button
                onClick={createFromOutput}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                🔍 Create From Output Elements
              </button>

              <button
                onClick={addDynamicOutput}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                ➕ Add Dynamic Output
              </button>
            </div>

            <div id="dynamic-container" style={{ marginTop: '30px' }}>
              <h3>Existing Output Elements:</h3>

              <output
                className="memori-artifact"
                data-mimetype="html"
                data-title="Sample HTML"
                data-sample="true"
              >
                <div
                  style={{
                    padding: '15px',
                    border: '2px solid #9333ea',
                    borderRadius: '8px',
                  }}
                >
                  <h3>Sample Artifact 1</h3>
                  <p>This is a static output element in the DOM.</p>
                </div>
              </output>

              <output
                className="memori-artifact"
                data-mimetype="markdown"
                data-title="Sample Markdown"
                data-sample="true"
              >
                {`# Sample Markdown
              
This is **another** static output element.

- Item 1
- Item 2
- Item 3`}
              </output>
            </div>

            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
              }}
            >
              <h3>💡 How it works</h3>
              <ol>
                <li>
                  Click &quot;Create From Output Elements&quot; to process{' '}
                  <code>&lt;output&gt;</code> elements
                </li>
                <li>
                  Each element gets converted to an artifact and added to
                  history
                </li>
                <li>
                  Click &quot;Add Dynamic Output&quot; to inject a new element
                </li>
                <li>Process again to handle the new element</li>
                <li>The artifacts will appear in the chat history</li>
              </ol>
            </div>
          </div>
        </>
      );
    };

    return <TestComponent />;
  },
};

export const APIBridge_WebSocketSimulation: Story = {
  args: {},
  render: () => {
    const TestComponent = () => {
      const { state } = useArtifact();

      const simulateWebSocket = () => {
        // Simulate receiving a message with artifacts from WebSocket
        const artifactContent = `
          <div style="padding: 20px; background: white; border-radius: .5rem; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2>📊 Sales Report Q4 2024</h2>
            <div style="display: flex; gap: 20px; margin-top: 20px;">
              <div style="flex: 1; padding: 15px; background: #ecfdf5; border-radius: .5rem;">
                <h3>Revenue</h3>
                <p style="font-size: 24px; font-weight: bold; color: #059669;">$124,500</p>
              </div>
              <div style="flex: 1; padding: 15px; background: #fef3c7; border-radius: .5rem;">
                <h3>Customers</h3>
                <p style="font-size: 24px; font-weight: bold; color: #d97706;">1,234</p>
              </div>
              <div style="flex: 1; padding: 15px; background: #dbeafe; border-radius: .5rem;">
                <h3>Growth</h3>
                <p style="font-size: 24px; font-weight: bold; color: #2563eb;">+23%</p>
              </div>
            </div>
          </div>
        `;

        // Use the API to create and open the artifact
        window.MemoriArtifactAPI?.createAndOpenArtifact(
          artifactContent,
          'html',
          'Data Visualization'
        );

        // Update chat display
        const chatContainer = document.getElementById('chat-simulation');
        if (chatContainer) {
          const messageHTML = `
            <div style="padding: 10px; margin: 10px 0; background: #f9fafb; border-radius: .5rem;">
              <p><strong>Bot:</strong> I've created a visualization for you. Click the artifact card to view it.</p>
              <div style="padding: 10px; margin-top: 10px; background: #e0e7ff; border-radius: .5rem; cursor: pointer;" onclick="window.MemoriArtifactAPI?.createAndOpenArtifact(\`${artifactContent.replace(
                /`/g,
                '\\`'
              )}\`, 'html', 'Data Visualization')">
                📊 Data Visualization
              </div>
            </div>
          `;
          chatContainer.innerHTML += messageHTML;
        }

        console.log('WebSocket artifact created via API');
      };

      const clearChat = () => {
        const chatContainer = document.getElementById('chat-simulation');
        if (chatContainer) {
          chatContainer.innerHTML =
            '<p style="color: #6b7280;">Chat cleared. Click "Simulate WebSocket Message" to add new content.</p>';
        }
      };

      return (
        <>
          {/* Conditionally render ArtifactDrawer to avoid hooks error */}
          {state.isDrawerOpen && <ArtifactDrawer />}

          <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
            <h1>🌐 WebSocket Integration Simulation</h1>
            <p>
              This demonstrates how <code>createAndOpenArtifact</code> can be
              used with WebSocket or Action Cable to create artifacts from
              messages received dynamically.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={simulateWebSocket}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#9333ea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                📡 Simulate WebSocket Message
              </button>

              <button
                onClick={clearChat}
                style={{
                  padding: '12px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                }}
              >
                🗑️ Clear Chat
              </button>
            </div>

            <div
              id="chat-simulation"
              style={{
                marginTop: '30px',
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                minHeight: '200px',
              }}
            >
              <p style={{ color: '#6b7280' }}>
                Click &quot;Simulate WebSocket Message&quot; to receive a
                message with an artifact...
              </p>
            </div>

            <div
              style={{
                marginTop: '30px',
                padding: '15px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
              }}
            >
              <h3>💡 Implementation Example</h3>
              <pre
                style={{
                  backgroundColor: 'white',
                  padding: '10px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '13px',
                }}
              >
                {`// Rails Action Cable
consumer.subscriptions.create("ChatChannel", {
  received(data) {
    if (data.artifact) {
      // Create artifact directly from received data
      window.MemoriArtifactAPI?.createAndOpenArtifact(
        data.artifact.content,
        data.artifact.mimeType,
        data.artifact.title
      );
    }
  }
});`}
              </pre>
            </div>
          </div>
        </>
      );
    };

    return <TestComponent />;
  },
};
