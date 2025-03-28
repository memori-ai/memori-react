import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './Tabs';

const defaultItems = [
  {
    key: 'tab1',
    label: 'Tab 1',
    children: <div>Content of Tab 1</div>,
  },
  {
    key: 'tab2',
    label: 'Tab 2',
    children: <div>Content of Tab 2</div>,
  },
  {
    key: 'tab3',
    label: 'Tab 3',
    children: <div>Content of Tab 3</div>,
  },
];

describe('Tabs Component', () => {
  it('renders Tabs unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with defaultActiveKey unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        defaultActiveKey="tab2"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with activeKey unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        activeKey="tab3"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with disabled tab unchanged', () => {
    const { container } = render(
      <Tabs 
        items={[
          ...defaultItems.slice(0, 1),
          { ...defaultItems[1], disabled: true },
          ...defaultItems.slice(2)
        ]} 
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with tab position bottom unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        tabPosition="bottom"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with tab position left unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        tabPosition="left"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with tab position right unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        tabPosition="right"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs centered unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        centered
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with size small unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        size="small"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with size large unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        size="large"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with type card unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        type="card"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs with type editable-card unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        type="editable-card"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('renders Tabs without animation unchanged', () => {
    const { container } = render(
      <Tabs 
        items={defaultItems} 
        animated={false}
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onChange when tab is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Tabs 
        items={defaultItems} 
        data-testid="test-tabs"
        onChange={handleChange}
      />
    );
    
    // Click on the second tab
    const tab2 = screen.getByTestId('test-tabs-tab-tab2');
    fireEvent.click(tab2);
    
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('does not call onChange when disabled tab is clicked', () => {
    const handleChange = jest.fn();
    render(
      <Tabs 
        items={[
          ...defaultItems.slice(0, 1),
          { ...defaultItems[1], disabled: true },
          ...defaultItems.slice(2)
        ]} 
        data-testid="test-tabs"
        onChange={handleChange}
      />
    );
    
    // Click on the disabled tab
    const disabledTab = screen.getByTestId('test-tabs-tab-tab2');
    fireEvent.click(disabledTab);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('displays the content of the selected tab', () => {
    render(
      <Tabs 
        items={defaultItems} 
        defaultActiveKey="tab2"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    
    // Check if content of tab2 is visible
    const content = screen.getByText('Content of Tab 2');
    expect(content).toBeTruthy();
  });

  it('changes content when a new tab is selected', () => {
    render(
      <Tabs 
        items={defaultItems} 
        defaultActiveKey="tab1"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    
    // Initially tab1 content should be visible
    expect(screen.getByText('Content of Tab 1')).toBeTruthy();
    
    // Click on tab3
    const tab3 = screen.getByTestId('test-tabs-tab-tab3');
    fireEvent.click(tab3);
    
    // Now tab3 content should be visible
    expect(screen.getByText('Content of Tab 3')).toBeTruthy();
  });

  it('updates when activeKey prop changes', () => {
    const { rerender } = render(
      <Tabs 
        items={defaultItems} 
        activeKey="tab1"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    
    // Initially tab1 content should be visible
    expect(screen.getByText('Content of Tab 1')).toBeTruthy();
    
    // Update activeKey prop
    rerender(
      <Tabs 
        items={defaultItems} 
        activeKey="tab3"
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    
    // Now tab3 content should be visible
    expect(screen.getByText('Content of Tab 3')).toBeTruthy();
  });

  it('renders tabs with icons', () => {
    const { container } = render(
      <Tabs 
        items={[
          {
            key: 'tab1',
            label: 'Tab 1',
            children: <div>Content of Tab 1</div>,
            icon: <span data-testid="tab-icon">Icon</span>
          },
          ...defaultItems.slice(1)
        ]}
        data-testid="test-tabs"
        onChange={jest.fn()}
      />
    );
    
    expect(screen.getByTestId('tab-icon')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });
});