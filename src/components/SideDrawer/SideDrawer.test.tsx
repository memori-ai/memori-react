import { render, screen } from '../../testUtils';
import SideDrawer, { SideDrawerEmpty } from './SideDrawer';

it('renders the shared header, body and optional footer', () => {
  render(
    <SideDrawer
      open
      title="Panel title"
      description="Panel description"
      closeLabel="Close panel"
      footer={<span>Footer slot</span>}
      onClose={jest.fn()}
    >
      Body content
    </SideDrawer>
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Panel title')).toBeInTheDocument();
  expect(screen.getByText('Panel description')).toBeInTheDocument();
  expect(screen.getByText('Body content')).toBeInTheDocument();
  expect(screen.getByText('Footer slot')).toBeInTheDocument();
});

it('omits the footer when none is passed', () => {
  const { container } = render(
    <SideDrawer open title="Only header" onClose={jest.fn()}>
      Body
    </SideDrawer>
  );

  expect(container.querySelector('.memori-drawer__footer')).toBeNull();
  expect(screen.getByText('Body')).toBeInTheDocument();
});

it('renders a neutral empty state', () => {
  render(
    <SideDrawerEmpty
      title="Nothing here"
      description="This is not an error."
    />
  );

  expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
  expect(screen.getByRole('status')).toHaveTextContent('This is not an error.');
});
