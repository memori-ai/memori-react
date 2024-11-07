import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import './Slider.css';

export interface Props {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  label?: string;
  onChange?: (value: number) => void;
}

const CustomSlider = ({ 
  min = 0, 
  max = 100, 
  step = 1, 
  defaultValue = 50,
  label,
  onChange,
}: Props) => {
  const [value, setValue] = useState(defaultValue);
  
  const percentage = ((value - min) / (max - min)) * 100;
  
  const marks = [];
  for (let i = min; i <= max; i += (max - min) / 4) {
    marks.push(Math.round(i));
  }

  const handleSliderClick = (e: any) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - bounds.left;
    const sliderWidth = bounds.width;
    const percentage = (clickPosition / sliderWidth) * 100;
    const newValue = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.min(Math.max(steppedValue, min), max);
    
    setValue(clampedValue);
    onChange?.(clampedValue);
  };

  return (
    <div className="slider-container" style={{ '--percentage': `${percentage}%` } as React.CSSProperties}>
      <div className="slider-header">
        <span className="slider-label">{label}</span>
        {/* <span className="slider-value">{value}</span> */}
      </div>
      
      <div className="slider-track-container" onClick={handleSliderClick}>
        <div className="slider-track">
          <div className="slider-track-fill" />
        </div>

        <div className="slider-marks">
          {marks.map((mark) => (
            <div key={mark} className="slider-mark">
              <div className="slider-mark-line" />
              <span className="slider-mark-value">{mark}</span>
            </div>
          ))}
        </div>

        <Listbox value={value} onChange={setValue}>
          <div className="slider-thumb" />
        </Listbox>
      </div>
    </div>
  );
};

export default CustomSlider;