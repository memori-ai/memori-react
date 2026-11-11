import { render } from '@testing-library/react';
import { highlightMatches } from './highlightMatches';

it('highlights query terms that appear in the snippet', () => {
  const { container } = render(
    <>{highlightMatches('We use the DJI Mic Mini on set.', 'Which microphones and DJI kit?')}</>
  );

  expect(container.querySelector('mark')?.textContent).toMatch(/DJI/i);
});

it('returns plain text when nothing matches', () => {
  const result = highlightMatches('Hello there', 'xy');
  expect(result).toBe('Hello there');
});
