import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import DatePicker from './DatePicker';
import './DatePicker.css';

// Custom calendar icon component
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'date' },
    onChange: { action: 'date changed' },
    locale: {
      control: 'select',
      options: ['en', 'it'],
      description: 'The locale to use for formatting dates',
    },
    showTimeSelect: {
      control: 'boolean',
      description: 'Whether to show time picker',
    },
    timeIntervals: {
      control: { type: 'number', min: 5, max: 60, step: 5 },
      description: 'The time intervals in minutes',
    },
    calendarStartDay: {
      control: { type: 'number', min: 0, max: 6 },
      description: 'First day of week (0 = Sunday, 1 = Monday)',
    },
    dateFormat: {
      control: 'text',
      description: 'Date format string',
    },
    popperPlacement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end'],
      description: 'Calendar placement',
    },
    isClearable: {
      control: 'boolean',
      description: 'Whether the date can be cleared',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
  },
  args: {
    onChange: (date) => console.log('Date changed:', date),
    placeholderText: 'DD/MM/YYYY',
    showTimeSelect: false,
    calendarStartDay: 1,
    timeIntervals: 15,
    dateFormat: 'PP',
    isClearable: false,
    disabled: false,
    locale: 'en',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '320px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// Basic example
export const Basic: Story = {
  args: {},
};

// With default selected date
export const WithSelectedDate: Story = {
  args: {
    selected: new Date(),
  },
};

// With time selection
export const WithTimeSelect: Story = {
  args: {
    showTimeSelect: true,
    selected: new Date(),
    timeCaption: 'Time',
    timeIntervals: 15,
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    icon: <CalendarIcon />,
  },
};

// Italian locale
export const ItalianLocale: Story = {
  args: {
    locale: 'it',
    calendarStartDay: 1,
    timeCaption: 'Ora',
    placeholderText: 'GG/MM/AAAA',
  },
};

// Clearable
export const Clearable: Story = {
  args: {
    isClearable: true,
    selected: new Date(),
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    disabled: true,
    selected: new Date(),
  },
};

// Right aligned popup
export const RightAligned: Story = {
  args: {
    popperPlacement: 'bottom-end',
  },
};

// With label
export const WithLabel: Story = {
  args: {
    label: 'Select Date',
  },
};

// Custom date format
export const CustomFormat: Story = {
  args: {
    dateFormat: 'dd/MM/yyyy HH:mm',
    showTimeSelect: true,
    selected: new Date(),
  },
};

// Interactive example with state hooks
export const Interactive: Story = {
  render: (args) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    
    const handleStartDateChange = (date: Date | null) => {
      setStartDate(date);
      if (date && endDate && date > endDate) {
        setEndDate(date);
      }
    };
    
    const handleEndDateChange = (date: Date | null) => {
      setEndDate(date);
    };
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label className="memori-datepicker--label">Start Date</label>
          <DatePicker
            {...args}
            selected={startDate}
            onChange={handleStartDateChange}
            placeholderText="Select start date"
            showTimeSelect
            icon={<CalendarIcon />}
            isClearable
          />
        </div>
        
        <div>
          <label className="memori-datepicker--label">End Date</label>
          <DatePicker
            {...args}
            selected={endDate}
            onChange={handleEndDateChange}
            placeholderText="Select end date"
            showTimeSelect
            icon={<CalendarIcon />}
            isClearable
            disabled={!startDate}
          />
        </div>
        
        {startDate && endDate && (
          <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Selected Range: {startDate.toLocaleString()} to {endDate.toLocaleString()}
            </p>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive example showing date range selection with two DatePickers.',
      },
    },
  },
};