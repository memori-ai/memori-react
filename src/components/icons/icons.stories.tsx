import React from 'react';
import { Meta, Story } from '@storybook/react';

import './loading.css';
import './icons.stories.css';

interface Props {
  iconName: string;
}

interface IconProps {
  className?: string;
  title?: string;
}

// Import all icons at module level
const iconContext = (require as any).context('./', false, /\.tsx$/);
const iconModules: { [key: string]: React.ComponentType<any> } = {};

iconContext.keys().forEach((key: string) => {
  const iconName = key.replace('./', '').replace('.tsx', '');
  if (!iconName.includes('stories')) {
    iconModules[iconName] = iconContext(key).default;
  }
});

const IconShowcaseItem = ({ iconName, ...iconProps }: Props & IconProps) => {
  const Icon = iconModules[iconName];
  if (!Icon) return null;
  return <Icon {...iconProps} className="showcase-icon" />;
};

const IconsShowcase = (iconProps: IconProps) => {
  const iconNames = Object.keys(iconModules);
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridGap: '2rem',
      }}
    >
      {iconNames.map(iconName => (
        <div
          key={iconName}
          style={{
            textAlign: 'center',
          }}
        >
          <IconShowcaseItem iconName={iconName} {...iconProps} />
          <p>{iconName}</p>
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: 'Definitions/Icons',
  component: IconsShowcase,
  argTypes: {
    children: {
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

const Template: Story<IconProps> = args => <IconsShowcase {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Showcase = Template.bind({});

Showcase.args = {};
