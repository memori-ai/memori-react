import React from 'react';
import { render } from '@testing-library/react';
import DatePicker from './DatePicker';
import { format } from 'date-fns';

// Mock the date so tests are predictable
const mockDate = new Date(2025, 3, 10); // April 10, 2025
jest.useFakeTimers().setSystemTime(mockDate);

describe('DatePicker', () => {
  test('renders with default props', () => {
    const handleChange = jest.fn();
    const { container } = render(<DatePicker onChange={handleChange} />);

    // Check that the component renders
    const datepickerElement = container.querySelector('.memori-datepicker');
    expect(datepickerElement).not.toBeNull();
    
    // Input should be rendered with the placeholder
    const input = container.querySelector('input');
    expect(input).not.toBeNull();
    expect(input?.getAttribute('placeholder')).toBe('DD/MM/YYYY');
  });

  test('renders with selected date', () => {
    const handleChange = jest.fn();
    const selectedDate = new Date(2025, 3, 15); // April 15, 2025
    const { container } = render(<DatePicker onChange={handleChange} selected={selectedDate} dateFormat="PP" />);

    // Input should have the date value
    const input = container.querySelector('input');
    expect(input).not.toBeNull();
    expect(input?.value).toBe(format(selectedDate, 'PP'));
  });

  test('applies custom className', () => {
    const handleChange = jest.fn();
    const customClass = 'custom-datepicker';
    const { container } = render(<DatePicker onChange={handleChange} className={customClass} />);

    // Component should have the custom class
    const datepickerElement = container.querySelector('.memori-datepicker');
    expect(datepickerElement).not.toBeNull();
    expect(datepickerElement?.classList.contains(customClass)).toBe(true);
  });

  test('renders with icon', () => {
    const handleChange = jest.fn();
    const icon = <span data-testid="calendar-icon">icon</span>;
    const { container } = render(<DatePicker onChange={handleChange} icon={icon} />);

    // Icon should be rendered
    const iconContainer = container.querySelector('.memori-datepicker--icon');
    expect(iconContainer).not.toBeNull();
  });

  test('renders with label', () => {
    const handleChange = jest.fn();
    const label = 'Test Label';
    const { container } = render(<DatePicker onChange={handleChange} label={label} />);

    // Label should be rendered
    const labelElement = container.querySelector('.memori-datepicker--label');
    expect(labelElement).not.toBeNull();
    expect(labelElement?.textContent).toBe(label);
  });

  test('renders as disabled', () => {
    const handleChange = jest.fn();
    const { container } = render(<DatePicker onChange={handleChange} disabled />);

    // Input should be disabled
    const input = container.querySelector('input');
    expect(input).not.toBeNull();
    expect(input?.disabled).toBe(true);
  });

  test('renders with clearable option when a date is selected', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <DatePicker 
        onChange={handleChange} 
        selected={mockDate} 
        isClearable 
      />
    );

    // Clear button should be present
    const clearButton = container.querySelector('.memori-datepicker--clear-button');
    expect(clearButton).not.toBeNull();
  });

  test('renders with time selection options when showTimeSelect is true', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <DatePicker 
        onChange={handleChange} 
        selected={mockDate}
        showTimeSelect
      />
    );

    // Just check that the component renders successfully
    const datepickerElement = container.querySelector('.memori-datepicker');
    expect(datepickerElement).not.toBeNull();
  });

  test('renders with custom timeCaption', () => {
    const handleChange = jest.fn();
    const customCaption = 'Custom Time';
    const { container } = render(
      <DatePicker 
        onChange={handleChange} 
        selected={mockDate}
        showTimeSelect
        timeCaption={customCaption}
      />
    );

    // Just check that the component renders with the props
    const datepickerElement = container.querySelector('.memori-datepicker');
    expect(datepickerElement).not.toBeNull();
  });

  test('renders with custom popperPlacement', () => {
    const handleChange = jest.fn();
    const { container } = render(
      <DatePicker 
        onChange={handleChange} 
        popperPlacement="bottom-end"
      />
    );

    // Component should render successfully
    const datepickerElement = container.querySelector('.memori-datepicker');
    expect(datepickerElement).not.toBeNull();
  });
});