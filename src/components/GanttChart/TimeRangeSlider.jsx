import React, { useEffect, useRef } from 'react';
import './TimeRangeSlider.css';

/**
 * A component for controlling the zoom level of the Gantt chart
 * @param {Object} props - Component props
 * @param {string} props.zoomLevel - Current zoom level ('large', 'medium', 'small')
 * @param {Function} props.onZoomChange - Function to call when zoom level changes
 */
const TimeRangeSlider = ({ zoomLevel, onZoomChange }) => {
  const sliderRef = useRef(null);
  
  const handleSliderChange = (e) => {
    const value = e.target.value;
    let level;
    
    // Map slider value to zoom level
    if (value <= 33) {
      level = 'large'; // 12-hour view
    } else if (value <= 66) {
      level = 'medium'; // 4-hour view
    } else {
      level = 'small'; // 1-hour view
    }
    
    onZoomChange(level);
    updateSliderFill(value);
  };
  
  // Calculate slider value based on current zoom level
  const sliderValue = zoomLevel === 'large' ? 0 : zoomLevel === 'medium' ? 50 : 100;
  
  // Update the slider fill based on value
  const updateSliderFill = (value) => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--value-percent', `${value}%`);
    }
  };
  
  // Apply the initial fill
  useEffect(() => {
    updateSliderFill(sliderValue);
  }, [sliderValue]);
  
  
  return (
    <>
      <div className="time-range-slider">
        <div className="slider-label">Time Range:</div>
        <div className="slider-container">
          <span className="range-label">12h</span>
          <input
            ref={sliderRef}
            type="range"
            min="0"
            max="100"
            value={sliderValue}
            onChange={handleSliderChange}
            className="slider"
          />
          <span className="range-label">1h</span>
        </div>
        <div className="zoom-info">
          {
            zoomLevel === 'large' ? '12-hour range' :
            zoomLevel === 'medium' ? '4-hour range' :
            '1-hour range'
          }
        </div>
      </div>
    </>
  );
};

export default TimeRangeSlider;