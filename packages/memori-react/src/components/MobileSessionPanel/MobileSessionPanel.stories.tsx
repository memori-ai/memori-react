import React, { useEffect, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AlertProvider } from '@memori.ai/ui';
import {
  Expand,
  MapPin,
  MessageCircle,
  Share2,
  Trash2,
  Users,
} from 'lucide-react';
import { history, memori, tenant, user } from '../../mocks/data';
import ShareButton from '../ShareButton/ShareButton';
import MobileSessionPanel, {
  MobileSessionPanelProps,
  MobileSessionPanelTrigger,
  useSessionPanelEntries,
} from './MobileSessionPanel';

type SessionAction = MobileSessionPanelProps['actions'][number];

const shareAction: SessionAction = {
  key: 'share',
  icon: <Share2 size={18} />,
  title: 'Share chat',
  subtitle: 'Copy link or download',
  view: 'share',
};

const locationAction: SessionAction = {
  key: 'location',
  icon: <MapPin size={18} />,
  title: 'Location tracking',
  subtitle: 'Currently off',
  view: 'location',
};

const clearAction: SessionAction = {
  key: 'clear',
  icon: <Trash2 size={18} />,
  title: 'Clear chat',
  onClick: () => console.log('clear chat'),
};

const expertsAction: SessionAction = {
  key: 'experts',
  icon: <Users size={18} />,
  title: 'Experts in this board',
  onClick: () => console.log('open experts'),
};

const fullscreenAction: SessionAction = {
  key: 'fullscreen',
  icon: <Expand size={18} />,
  title: 'Full screen',
  subtitle: 'Expand to immersive view',
  onClick: () => console.log('fullscreen'),
};

const chatHistoryAction: SessionAction = {
  key: 'chatHistory',
  icon: <MessageCircle size={18} />,
  title: 'Chat history',
  onClick: () => console.log('open chat history'),
};

const manyActions: SessionAction[] = [
  chatHistoryAction,
  fullscreenAction,
  shareAction,
  locationAction,
  expertsAction,
  clearAction,
  ...Array.from({ length: 6 }, (_, i) => ({
    key: `extra-${i}`,
    icon: <MessageCircle size={18} />,
    title: `Extra action ${i + 1}`,
    subtitle: 'Fills the panel to show the scrollbar',
    onClick: () => console.log(`extra action ${i + 1}`),
  })),
];

const historyWithConsumption = [
  ...history,
  {
    ...history[history.length - 1],
    llmUsage: {
      energyImpact: {
        energy: { parsedValue: 0.0012 },
        gwp: { parsedValue: 0.00045 },
        wcf: { parsedValue: 0.0021 },
      },
    },
  },
] as any;

/**
 * Header-like bar with the real trigger: shows the "more actions" menu,
 * or the single direct action when the panel would list only one entry.
 */
const PanelWithTrigger = (props: MobileSessionPanelProps) => {
  const [open, setOpen] = useState(props.open);
  const [venue, setVenue] = useState(props.venue);
  const entries = useSessionPanelEntries(props);

  useEffect(() => setOpen(props.open), [props.open]);

  const actions = props.actions.map(action =>
    action.onClick
      ? {
          ...action,
          onClick: () => {
            action.onClick?.();
            setOpen(false);
          },
        }
      : action
  );

  return (
    <div
      className="memori-widget"
      style={{
        position: 'relative',
        height: 640,
        maxWidth: 420,
        margin: '0 auto',
        border: '1px solid var(--memori-border-color, #e5e7eb)',
        background: 'var(--memori-main-background, #fff)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0.75rem',
        }}
      >
        <MobileSessionPanelTrigger
          entries={entries}
          open={open}
          onToggle={() => setOpen(current => !current)}
        />
      </div>
      <MobileSessionPanel
        {...props}
        actions={actions}
        open={open}
        onClose={() => setOpen(false)}
        initialView={
          entries.directAction?.view ?? props.initialView ?? 'session'
        }
        venue={venue}
        setVenue={setVenue}
      />
    </div>
  );
};

const meta: Meta<typeof MobileSessionPanel> = {
  title: 'Surfaces/Mobile Session Panel',
  component: MobileSessionPanel,
  decorators: [
    Story => (
      <AlertProvider defaultDuration={5000}>
        <div style={{ padding: '1rem', boxSizing: 'border-box' }}>
          <Story />
        </div>
      </AlertProvider>
    ),
  ],
  render: args => <PanelWithTrigger {...args} />,
  args: {
    open: false,
    presentation: 'popover',
    title: 'Session',
    userName: '',
    actions: [shareAction, locationAction, clearAction],
    history,
    sharePageTitle: 'Share',
    locationPageTitle: 'Location tracking',
    backLabel: 'Back',
    loginLabel: 'Log in',
    logoutLabel: 'Log out',
    shareContent: (
      <ShareButton
        tenant={tenant}
        memori={memori}
        sessionID="session-id"
        title={memori.name}
        align="left"
        history={history}
        renderMode="inline"
      />
    ),
  },
  argTypes: {
    presentation: {
      control: 'inline-radio',
      options: ['popover', 'sheet'],
    },
    onClose: { action: 'closed' },
    onLogin: { action: 'login' },
    onLogout: { action: 'logout' },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof MobileSessionPanel>;

export const MoreActions: Story = {
  args: {
    open: true,
  },
};

export const SingleDirectAction: Story = {
  args: {
    actions: [clearAction],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Only one action and no login / active user: the trigger runs the action directly instead of showing the "more actions" menu.',
      },
    },
  },
};

export const SingleViewAction: Story = {
  args: {
    actions: [shareAction],
  },
  parameters: {
    docs: {
      description: {
        story:
          'The single action opens a panel page: the trigger shows its icon and opens the panel straight on that page, without the Back button.',
      },
    },
  },
};

export const SingleActionWithLogin: Story = {
  args: {
    open: true,
    actions: [clearAction],
    showLogin: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Login is available, so the "more actions" menu stays even with a single action.',
      },
    },
  },
};

export const LoggedIn: Story = {
  args: {
    open: true,
    showLogin: true,
    isLoggedIn: true,
    loginToken: 'login-token',
    user,
    userName: user.userName ?? 'User',
    userEmail: user.eMail,
    actions: [chatHistoryAction, shareAction, locationAction, clearAction],
    showMessageConsumption: true,
    history: historyWithConsumption,
  },
};

export const Scrollable: Story = {
  args: {
    open: true,
    showLogin: true,
    actions: manyActions,
    showMessageConsumption: true,
    history: historyWithConsumption,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Enough entries to overflow the popover and show the app-wide thin scrollbar.',
      },
    },
  },
};

export const Sheet: Story = {
  args: {
    open: true,
    presentation: 'sheet',
    showLogin: true,
    actions: manyActions,
  },
};
