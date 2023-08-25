import { render } from '@testing-library/react';
import Typing from './Typing';

it('renders Typing unchanged', () => {
  const { container } = render(<Typing />);
  expect(container).toMatchSnapshot();
});
