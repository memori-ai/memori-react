import React, { useState, useRef, useEffect } from 'react';
import { Listbox } from '@headlessui/react';
import cx from 'classnames';
export interface Props {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string | React.ReactNode;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

const CustomSlider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  label,
  onChange,
  disabled = false,
}: Props) => {
  const [value, setValue] = useState(defaultValue);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const percentage = ((value - min) / (max - min)) * 100;

  const marks = [];
  for (let i = min; i <= max; i += (max - min) / 4) {
    marks.push(Math.round(i));
  }

  const calculateNewValue = (clientX: number) => {
    if (!sliderRef.current) return value;

    const bounds = sliderRef.current.getBoundingClientRect();
    const position = clientX - bounds.left;
    const sliderWidth = bounds.width;
    const percentage = Math.max(0, Math.min(100, (position / sliderWidth) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  const handleInteractionStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    const newValue = calculateNewValue(clientX);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || disabled) return;
    const newValue = calculateNewValue(clientX);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent scrolling while dragging
      handleInteractionMove(e.touches[0].clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleInteractionMove(e.clientX);
    };

    const handleEndInteraction = () => {
      handleInteractionEnd();
    };

    if (isDragging) {
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchend', handleEndInteraction);
      window.addEventListener('mouseup', handleEndInteraction);
    }

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleEndInteraction);
      window.removeEventListener('mouseup', handleEndInteraction);
    };
  }, [isDragging]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div 
      className={cx('memori--slider-container', { 'memori--slider-disabled': disabled })}
      style={{ '--percentage': `${percentage}%` } as React.CSSProperties}
    >
      <div className="memori--slider-header">
        {label && <div className="memori--slider-label">{label}</div>}
        <div className="memori--slider-value">{value}</div>
      </div>
      
      <div
        ref={sliderRef}
        className="memori--slider-track-container"
        onMouseDown={(e) => handleInteractionStart(e.clientX)}
        onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
      >
        <div className="memori--slider-track">
          <div className="memori--slider-track-fill" />
        </div>

        <div className="memori--slider-marks">
          {marks.map((mark) => (
            <div key={mark} className="memori--slider-mark">
              <div className="memori--slider-mark-line" />
              <span className="memori--slider-mark-value">{mark}</span>
            </div>
          ))}
        </div>

        <Listbox value={value} onChange={setValue} disabled={disabled}>
          <div 
            className="memori--slider-thumb"
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            tabIndex={disabled ? -1 : 0}
          />
        </Listbox>
      </div>
    </div>
  );
};

export default CustomSlider;