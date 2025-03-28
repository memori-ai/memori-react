import React, { useState, useEffect, Fragment } from 'react';
import { Tab } from '@headlessui/react';
import cx from 'classnames';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface Props {
  className?: string;
  defaultActiveKey?: string;
  activeKey?: string;
  onChange?: (activeKey: string) => void;
  items: TabItem[];
  tabPosition?: 'top' | 'bottom' | 'left' | 'right';
  centered?: boolean;
  size?: 'small' | 'default' | 'large';
  type?: 'line' | 'card' | 'editable-card';
  animated?: boolean;
  'data-testid'?: string;
}

const Tabs = ({
  className,
  defaultActiveKey,
  activeKey,
  onChange,
  items,
  tabPosition = 'top',
  centered = false,
  size = 'default',
  type = 'line',
  animated = true,
  'data-testid': testId,
}: Props) => {
  // Find the initial selected index based on defaultActiveKey or activeKey
  const getInitialIndex = (): number => {
    if (activeKey !== undefined) {
      const index = items.findIndex(item => item.key === activeKey);
      return index >= 0 ? index : 0;
    }
    if (defaultActiveKey !== undefined) {
      const index = items.findIndex(item => item.key === defaultActiveKey);
      return index >= 0 ? index : 0;
    }
    return 0;
  };

  const [selectedIndex, setSelectedIndex] = useState(getInitialIndex());

  // Update selectedIndex when activeKey changes (for controlled component)
  useEffect(() => {
    if (activeKey !== undefined) {
      const index = items.findIndex(item => item.key === activeKey);
      if (index >= 0) {
        setSelectedIndex(index);
      }
    }
  }, [activeKey, items]);

  const handleChange = (index: number) => {
    if (!items[index]?.disabled) {
      setSelectedIndex(index);
      
      if (onChange && items[index]) {
        onChange(items[index].key);
      }
    }
  };

  const isVertical = tabPosition === 'left' || tabPosition === 'right';

  return (
    <div 
      className={cx(
        'memori-tabs',
        `memori-tabs--${type}`,
        `memori-tabs--${size}`,
        `memori-tabs--${tabPosition}`,
        {
          'memori-tabs--centered': centered && !isVertical,
          'memori-tabs--animated': animated,
        },
        className
      )}
      data-testid={testId}
    >
      <Tab.Group 
        selectedIndex={selectedIndex}
        onChange={handleChange}
        vertical={isVertical}
      >
        <Tab.List className={cx('memori-tabs--list', {
          'memori-tabs--list-vertical': isVertical
        })}>
          {items.map((item) => (
            <Tab
              key={item.key}
              className={({ selected }) => cx(
                'memori-tabs--tab',
                {
                  'memori-tabs--tab-selected': selected,
                  'memori-tabs--tab-disabled': item.disabled,
                  'memori-tabs--tab-with-icon': !!item.icon
                }
              )}
              disabled={item.disabled}
              data-testid={`${testId}-tab-${item.key}`}
            >
              {({ selected }) => (
                <Fragment>
                  {item.icon && (
                    <span className="memori-tabs--tab-icon">{item.icon}</span>
                  )}
                  <span className="memori-tabs--tab-label">{item.label}</span>
                  {type === 'line' && (
                    <span className={cx('memori-tabs--tab-line', {
                      'memori-tabs--tab-line-active': selected
                    })} />
                  )}
                </Fragment>
              )}
            </Tab>
          ))}
        </Tab.List>
        
        <Tab.Panels className="memori-tabs--panels">
          {items.map((item) => (
            <Tab.Panel
              key={item.key}
              className={cx('memori-tabs--panel', {
                'memori-tabs--panel-animated': animated
              })}
              data-testid={`${testId}-panel-${item.key}`}
            >
              {item.children}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;