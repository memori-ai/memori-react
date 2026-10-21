import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { instructionProposals } from '../../mocks/data';
import { InstructionProposalConfirm } from '../../types/instructionProposal';
import InstructionProposalCard, { Props } from './InstructionProposalCard';

import './InstructionProposalCard.css';

// Answers as the engine does: handled after a short wait. Parameters are not logged, they can hold secrets
const handled: InstructionProposalConfirm = (proposalID, apply, parameters) =>
  new Promise(resolve => {
    console.log('confirm', proposalID, apply, Object.keys(parameters ?? {}));
    setTimeout(() => resolve(true), 500);
  });

const notPending: InstructionProposalConfirm = () =>
  new Promise(resolve => setTimeout(() => resolve(false), 500));

const failing: InstructionProposalConfirm = () =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Network error')), 500)
  );

const meta = {
  title: 'Internals/Instruction Proposal Card',
  component: InstructionProposalCard,
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
  decorators: [
    Story => (
      <div style={{ width: '480px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onConfirm: handled,
  },
} satisfies Meta<Props>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NewContent: Story = {
  args: { medium: instructionProposals.newContent },
};

export const ContentVariants: Story = {
  args: { medium: instructionProposals.contentVariants },
};

export const ContentAnswerChange: Story = {
  args: { medium: instructionProposals.contentAnswerChange },
};

export const PromptChange: Story = {
  args: { medium: instructionProposals.promptChange },
};

export const PromptRevert: Story = {
  args: { medium: instructionProposals.promptRevert },
};

export const AttachmentPlacement: Story = {
  args: { medium: instructionProposals.attachmentPlacement },
};

export const Snippet: Story = {
  args: { medium: instructionProposals.snippet },
};

export const LandingPage: Story = {
  args: { medium: instructionProposals.landingPage },
};

export const Connector: Story = {
  args: { medium: instructionProposals.connector },
};

export const ConnectorOptionalFields: Story = {
  args: { medium: instructionProposals.connectorOptionalFields },
};

export const ConnectorWithoutFields: Story = {
  args: { medium: instructionProposals.connectorWithoutFields },
};

export const Applied: Story = {
  args: { medium: instructionProposals.newContent, defaultStatus: 'applied' },
};

export const ConnectorLinked: Story = {
  args: { medium: instructionProposals.connector, defaultStatus: 'applied' },
};

export const Ignored: Story = {
  args: { medium: instructionProposals.newContent, defaultStatus: 'ignored' },
};

export const NotPending: Story = {
  args: {
    medium: instructionProposals.contentAnswerChange,
    defaultStatus: 'notPending',
  },
};

export const ErrorStatus: Story = {
  args: { medium: instructionProposals.connector, defaultStatus: 'error' },
};

export const ReadOnly: Story = {
  args: { medium: instructionProposals.newContent, onConfirm: undefined },
};

export const AlreadyConfirmedInChat: Story = {
  args: { medium: instructionProposals.newContent, onConfirm: notPending },
};

export const ConfirmationFails: Story = {
  args: { medium: instructionProposals.connector, onConfirm: failing },
};
