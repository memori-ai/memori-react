import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DateSelector from './DateSelector';

const dateMock = new Date(Date.UTC(2022, 8, 24, 0, 0, 0, 0));

jest.setSystemTime(dateMock);
Date.now = jest.fn(() => dateMock.valueOf());

jest.spyOn(Date, 'now').mockImplementation(() => dateMock.valueOf());

describe('DateSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders DateSelector with empty inputs when no defaultDate provided', () => {
    render(<DateSelector onChange={mockOnChange} />);

    const dayInput = screen.getByLabelText(/day/i);
    const monthInput = screen.getByLabelText(/month/i);
    const yearInput = screen.getByLabelText(/year/i);

    expect(dayInput).toHaveValue(null); // number input value is null/empty string
    expect(monthInput).toHaveValue(null);
    expect(yearInput).toHaveValue(null);

    // Should call onChange with undefined initially or not at all if we want strict behavior
    // Based on implementation: useEffect triggers on mount. If empty, calls onChange(undefined).
    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('renders DateSelector with default value correctly', () => {
    const defaultDate = new Date(Date.now());
    render(
      <DateSelector defaultDate={defaultDate} onChange={mockOnChange} />
    );

    const dayInput = screen.getByLabelText(/day/i);
    const monthInput = screen.getByLabelText(/month/i);
    const yearInput = screen.getByLabelText(/year/i);

    expect(dayInput).toHaveValue(defaultDate.getDate());
    expect(monthInput).toHaveValue(defaultDate.getMonth() + 1);
    expect(yearInput).toHaveValue(defaultDate.getFullYear());
  });

  describe('Desktop View', () => {
    it('updates day and calls onChange with undefined if incomplete', () => {
      render(<DateSelector onChange={mockOnChange} />);
      const dayInput = screen.getByLabelText(/day/i);

      fireEvent.change(dayInput, { target: { value: '15' } });

      expect(dayInput).toHaveValue(15);
      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });

    it('calls onChange with valid date when all fields are filled', () => {
      render(<DateSelector onChange={mockOnChange} />);
      const dayInput = screen.getByLabelText(/day/i);
      const monthInput = screen.getByLabelText(/month/i);
      const yearInput = screen.getByLabelText(/year/i);

      fireEvent.change(dayInput, { target: { value: '15' } });
      fireEvent.change(monthInput, { target: { value: '5' } });
      fireEvent.change(yearInput, { target: { value: '1990' } });

      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          year: 1990,
          month: 5,
          day: 15,
        })
      );
    });

    it('auto-focuses month after day is filled', () => {
      render(<DateSelector onChange={mockOnChange} />);
      const dayInput = screen.getByLabelText(/day/i);
      const monthInput = screen.getByLabelText(/month/i);

      fireEvent.change(dayInput, { target: { value: '12' } });

      expect(monthInput).toHaveFocus();
    });

    it('auto-focuses year after month is filled', () => {
      render(<DateSelector onChange={mockOnChange} />);
      const monthInput = screen.getByLabelText(/month/i);
      const yearInput = screen.getByLabelText(/year/i);

      fireEvent.change(monthInput, { target: { value: '12' } });

      expect(yearInput).toHaveFocus();
    });

    it('disables all inputs when disabled prop is true', () => {
      render(<DateSelector disabled onChange={mockOnChange} />);

      const dayInput = screen.getByLabelText(/day/i);
      const monthInput = screen.getByLabelText(/month/i);
      const yearInput = screen.getByLabelText(/year/i);

      expect(dayInput).toBeDisabled();
      expect(monthInput).toBeDisabled();
      expect(yearInput).toBeDisabled();
    });
  });

  describe('Mobile View', () => {
    it('renders native date input on mobile', () => {
      render(<DateSelector onChange={mockOnChange} />);

      const dateInput = screen.getByLabelText(/date/i);
      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute('type', 'date');
    });

    it('calls onChange when mobile date input changes', async () => {
      render(<DateSelector onChange={mockOnChange} />);

      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.change(dateInput, { target: { value: '1995-06-15' } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(
          expect.objectContaining({
            year: 1995,
            month: 6,
            day: 15
          })
        );
      });
    });

    it('calls onChange with undefined when mobile input is cleared', async () => {
      render(<DateSelector defaultDate="1995-06-15" onChange={mockOnChange} />);

      const dateInput = screen.getByLabelText(/date/i);
      fireEvent.change(dateInput, { target: { value: '' } });

      await waitFor(() => {
        expect(mockOnChange).toHaveBeenCalledWith(undefined);
      });
    });
  });
});
