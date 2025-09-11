// ArtifactSystem.stories.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Message,
  Memori,
  Tenant,
} from '@memori.ai/memori-api-client/dist/types';
import CopyButtonTest from './test/CopyButtonTest';


const meta: Meta<typeof CopyButtonTest> = {
  title: 'Artifact System/CopyButtonTest',
  component: CopyButtonTest,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Stories
export const HTMLArtifact: Story = {
  args: {},
  render: () => (
    <CopyButtonTest
    />
  ),
};
