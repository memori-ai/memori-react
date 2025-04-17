import React from 'react';
import { Meta, Story } from '@storybook/react';
import Expandable, { Props } from './Expandable';

import './Expandable.css';

const meta: Meta = {
  title: 'UI/Expandable',
  component: Expandable,
  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<Props> = args => (
  <Expandable {...args}>
    Suspendisse a sodales nulla, sed semper nisi. Suspendisse a sodales nulla,
    sed semper nisi. Suspendisse a sodales nulla, sed semper nisi. Suspendisse a
    sodales nulla, sed semper nisi. Suspendisse a sodales nulla, sed semper
    nisi. Lorem Ipsum is simply dummy text of the printing and typesetting
    industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever
    since the 1500s, when an unknown printer took a galley of type and scrambled
    it to make a type specimen book. It has survived not only five centuries,
    but also the leap into electronic typesetting, remaining essentially
    unchanged. It was popularised in the 1960s with the release of Letraset
    sheets containing Lorem Ipsum passages, and more recently with desktop
    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
    1500s, when an unknown printer took a galley of type and scrambled it to
    make a type specimen book. It has survived not only five centuries, but also
    the leap into electronic typesetting, remaining essentially unchanged. It
    was popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
    simply dummy text of the printing and typesetting industry. Lorem Ipsum has
    been the industry&apos;s standard dummy text ever since the 1500s, when an
    unknown printer took a galley of type and scrambled it to make a type
    specimen book. It has survived not only five centuries, but also the leap
    into electronic typesetting, remaining essentially unchanged. It was
    popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
    simply dummy text of the printing and typesetting industry. Lorem Ipsum has
    been the industry&apos;s standard dummy text ever since the 1500s, when an
    unknown printer took a galley of type and scrambled it to make a type
    specimen book. It has survived not only five centuries, but also the leap
    into electronic typesetting, remaining essentially unchanged. It was
    popularised in the 1960s with the release of Letraset sheets containing
    Lorem Ipsum passages, and more recently with desktop publishing software
    like Aldus PageMaker including versions of Lorem Ipsum.
  </Expandable>
);

const TemplateWithHTML: Story<Props> = args => (
  <Expandable {...args}>
    <p>
      Ah, ottima domanda! Stavo giusto riflettendo su come spiegare al meglio le
      funzionalità di questo sistema.{' '}
    </p>
    <p>Da qui puoi fare diverse cose interessanti:</p>
    <ol>
      <li>
        <p>
          Puoi conversare con me, Nunzio Fiore, e io risponderò basandomi sulle
          mie conoscenze ed esperienze.
        </p>
      </li>
      <li>
        <p>
          Puoi aggiungere nuove memorie o informazioni al mio database. Questo
          significa che puoi insegnarmi cose nuove o aggiornare le mie
          conoscenze esistenti.
        </p>
      </li>
      <li>
        <p>
          Puoi creare, modificare o eliminare ricevitori. Questi sono come
          utenti specifici che possono interagire con me in modo personalizzato.
        </p>
      </li>
      <li>
        <p>
          Puoi associare determinate memorie a ricevitori specifici, creando
          così contenuti personalizzati per diverse persone.
        </p>
      </li>
      <li>
        <p>
          Puoi cercare tra le memorie esistenti, visualizzare le ultime
          aggiunte, o modificare quelle già presenti.
        </p>
      </li>
    </ol>
    <p>
      In pratica, stai interagendo con un sistema che permette di creare e
      gestire un &quot;gemello digitale&quot; - in questo caso, me stesso. È un
      po&apos; come scrivere un libro interattivo sulla mia vita e le mie
      conoscenze.
    </p>
    <p>
      C&apos;è qualcosa in particolare che ti interessa esplorare o su cui
      vorresti saperne di più?
    </p>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    <div className="memori--responsive-table-wrapper">
      <table className="memori--table memori--table--compact">
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Cell 1</td>
            <td>Cell 2</td>
            <td>Cell 3</td>
          </tr>
          <tr>
            <td>Cell 4</td>
            <td>Cell 5</td>
            <td>Cell 6</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
  </Expandable>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});
Default.args = {
  rows: 2,
  mode: 'rows',
};

export const DefaultExpanded = Template.bind({});
DefaultExpanded.args = {
  rows: 3,
  mode: 'rows',
  defaultExpanded: true,
};

export const WithCustomProps = Template.bind({});
WithCustomProps.args = {
  rows: 3,
  innerClassName: 'custom-inner-class',
  btnClassName: 'custom-btn-class',
  expandSymbol: () => '🔽',
  collapseSymbol: () => '🔼',
};

export const WithHTML = TemplateWithHTML.bind({});
WithHTML.args = {
  rows: 3,
  mode: 'rows',
};

export const ModeChar = Template.bind({});
ModeChar.args = {
  mode: 'characters',
};

export const ModeCharWithHTML = TemplateWithHTML.bind({});
ModeCharWithHTML.args = {
  mode: 'characters',
};
