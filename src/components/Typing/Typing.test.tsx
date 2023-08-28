import { render } from '@testing-library/react';
import Typing from './Typing';

it('renders Typing unchanged', () => {
  const { container } = render(<Typing />);
  expect(container).toMatchSnapshot();
});

it('renders Typing with default loading text unchanged', () => {
  const { container } = render(<Typing useDefaultSentences lang="en" />);
  expect(container).toMatchSnapshot();
});

it('renders Typing with default italian loading text unchanged', () => {
  const { container } = render(<Typing useDefaultSentences lang="it" />);
  expect(container).toMatchSnapshot();
});

it('renders Typing with custom loading text unchanged', () => {
  const { container } = render(
    <Typing sentence="Chiedo agli unicorni cosa ne pensano..." />
  );
  expect(container).toMatchSnapshot();
});
