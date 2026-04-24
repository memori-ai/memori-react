import React, { useState } from 'react';
import type { Meta, Story } from '@storybook/react';
import { AlertProvider } from '@memori.ai/ui';
import I18nWrapper from '../../I18nWrapper';
import { memori, venue } from '../../mocks/data';
import PositionPopover from './PositionPopover';

const meta: Meta = {
  title: 'Widget/PositionPopover',
  component: PositionPopover,
};

export default meta;

const Template: Story = () => {
  const [open, setOpen] = useState(true);
  const [v, setV] = useState(venue);
  return (
    <I18nWrapper>
      <AlertProvider defaultDuration={5000}>
        <div style={{ padding: 80 }}>
          <PositionPopover
            venue={v}
            setVenue={setV}
            open={open}
            onOpenChange={setOpen}
            triggerAriaLabel="Position"
            triggerButtonVariant="outline"
          />
          <p style={{ marginTop: 16 }}>memori: {memori.name}</p>
        </div>
      </AlertProvider>
    </I18nWrapper>
  );
};

export const Default = Template.bind({});
