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

it('passes an explicit width through to the drawer', () => {
  render(
    <SideDrawer open title="Wide" width="450px" onClose={jest.fn()}>
      Body
    </SideDrawer>
  );

  const dialog = screen.getByRole('dialog');
  expect(dialog).toHaveAttribute('data-custom-width', '');
  expect(dialog.getAttribute('style')).toContain(
    '--memori-drawer-width: 450px'
  );
});

it('defaults to 450px width and portals into the layout content row as a push panel', () => {
  const layoutRoot = document.createElement('div');
  const headerEl = document.createElement('div');
  headerEl.className = 'memori-fullpage-top-header';
  const contentRow = document.createElement('div');
  contentRow.className = 'memori-fullpage-content-row';
  layoutRoot.appendChild(headerEl);
  layoutRoot.appendChild(contentRow);
  document.body.appendChild(layoutRoot);

  try {
    render(
      <SideDrawer open title="Push panel" onClose={jest.fn()}>
        Push body
      </SideDrawer>
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('style')).toContain(
      '--memori-drawer-width: 450px'
    );
    expect(dialog).toHaveClass('memori-side-drawer--push');
    expect(contentRow).toContainElement(dialog);
  } finally {
    document.body.removeChild(layoutRoot);
  }
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
    <SideDrawerEmpty title="Nothing here" description="This is not an error." />
  );

  expect(screen.getByRole('status')).toHaveTextContent('Nothing here');
  expect(screen.getByRole('status')).toHaveTextContent('This is not an error.');
});
