import React from 'react';
import { Meta, Story } from '@storybook/react';
import I18nWrapper from '../../I18nWrapper';
import FilePreview from './FilePreview';

const MARKDOWN = `# Artifact Targeted Edits

Documentazione tecnica

**Data** 22 giu 2026  
**Autore** AI Agent (Cursor)

## Obiettivo

Eliminare la riscrittura integrale degli artifact quando l'utente richiede una modifica puntuale (\`cambia questa frase\`, \`aggiorna il colore\`, \`modifica l'emoji dei pinoli\`).

Prima di questa modifica il Memori riscriveva l'intero documento anche per un cambiamento minimo. Questo rendeva lenta la revisione e perdeva il contesto intorno alla modifica.

## Approccio

1. Individuare il frammento da aggiornare
2. Applicare la patch in-place
3. Conservare il resto del documento

Il titolo del file deve restare **sempre leggibile**, anche quando è lungo come \`artifact-targeted-edits-with-a-very-long-filename.md\`.

## Note

- heading, **grassetto** e \`codice inline\` devono restare visibili
- se il contenuto è più alto del popup, mostrare un cue di scroll invece di un taglio secco
`;

const meta: Meta = {
  title: 'Widget/FilePreview',
  component: FilePreview,
};

export default meta;

const Template: Story = args => (
  <I18nWrapper>
    <div style={{ maxWidth: 480, padding: 16 }}>
      <FilePreview {...args} />
    </div>
  </I18nWrapper>
);

export const MarkdownDocument = Template.bind({});
MarkdownDocument.args = {
  previewFiles: [
    {
      name: 'artifact-targeted-edits.md',
      id: '1',
      mimeType: 'text/markdown',
      type: 'document',
      content: MARKDOWN,
    },
  ],
  removeFile: () => undefined,
};
