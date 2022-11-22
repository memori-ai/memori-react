import React from 'react';
import { Meta, Story } from '@storybook/react';

interface Props {
  iconName: string;
}

interface IconProps {
  className?: string;
  title?: string;
}

const IconShowcaseItem = ({ iconName, ...iconProps }: Props & IconProps) => {
  const Icon = require(`../src/components/icons/${iconName}`).default;
  return <Icon {...iconProps} />;
};

const IconsShowcase = (iconProps: IconProps) => {
  const icons = require.context('../src/components/icons', false, /\.tsx$/);
  const iconNames = icons
    .keys()
    .map((key) => key.replace('./', '').replace('.tsx', ''));
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gridGap: '1rem',
      }}
    >
      {iconNames.map((iconName) => (
        <div key={iconName}>
          <IconShowcaseItem iconName={iconName} {...iconProps} />
          <p>{iconName}</p>
        </div>
      ))}
    </div>
  );
};

const meta: Meta = {
  title: 'Icons',
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

const Template: Story<IconProps> = (args) => <IconsShowcase {...args} />;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Showcase = Template.bind({});

Showcase.args = {};
