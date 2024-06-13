import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import '../../styles.css';

const ColorDisplay = ({ color }: { color: string }) => (
  <div
    style={{
      marginTop: '1rem',
    }}
  >
    <dt style={{ minWidth: 250, fontSize: '12px', marginBottom: '0.5rem' }}>
      --{color}
    </dt>
    <dd>
      <div
        className={`color-${color}`}
        style={{
          width: '100px',
          height: '100px',
          boxShadow: '0 0 0.5rem rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          background: `var(--${color})`,
        }}
        title={color}
      />
    </dd>
  </div>
);

const colors = [
  'memori-primary',
  'memori-primary-text',
  'memori-inner-bg',
  'memori-chat-bubble-bg',
  'memori-text-color',
  'memori-button-bg',
  'memori-button-text',
  'memori-button-border-color',
];

const variables = [
  'memori-inner-content-pad',
  'memori-button-padding',
  'memori-drawer--width',
  'memori-drawer--width--md',
  'memori-drawer--width--lg',
  'memori-modal--width',
  'memori-modal--width--md',
];

const Definitions = () => (
  <div>
    <h2>Colors</h2>
    <dl>
      {colors.map(color => (
        <ColorDisplay key={color} color={color} />
      ))}
    </dl>
    <h2>Others</h2>
    <dl>
      <div
        style={{
          marginTop: '1rem',
        }}
      >
        <dt style={{ minWidth: 250, fontSize: '12px', marginBottom: '0.5rem' }}>
          <p>--memori-button-box-shadow +</p>
          <p>--memori-button-radius</p>
        </dt>
        <dd>
          <div
            style={{
              boxShadow: 'var(--memori-button-box-shadow)',
              border: '1px solid #f3f3f3',
              width: '100px',
              height: '100px',
              borderRadius: 'var(--memori-button-radius)',
            }}
          />
        </dd>
      </div>
      <div
        style={{
          marginTop: '1rem',
        }}
      >
        <dt style={{ minWidth: 250, fontSize: '12px', marginBottom: '0.5rem' }}>
          --memori-blur-background
        </dt>
        <dd>
          <div
            style={{
              backgroundColor: '#eee',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              backgroundImage:
                'url(https://aisuru.com/images/aisuru/og-image.png)',
              filter: 'blur(var(--memori-blur-background, 0))',
              width: '200px',
              height: '100px',
              borderRadius: '10px',
            }}
          />
        </dd>
      </div>
    </dl>
    <ul
      style={{
        padding: 0,
        margin: 0,
        listStyle: 'none',
      }}
    >
      {variables.map(v => (
        <li
          key={v}
          style={{
            marginTop: '1rem',
          }}
        >
          <p
            style={{ minWidth: 250, fontSize: '12px', marginBottom: '0.5rem' }}
          >
            --{v}
          </p>
        </li>
      ))}
    </ul>
  </div>
);

export default {
  title: 'Definitions/CSS Variables',
  component: Definitions,
} as ComponentMeta<typeof Definitions>;

const Template: ComponentStory<typeof Definitions> = () => <Definitions />;
export const Default = Template.bind({});
