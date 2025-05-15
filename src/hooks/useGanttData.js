import { useState, useEffect } from 'react';
import { transformDataForGantt, calculateTimeWindow } from '../utils/dataTransformer';

/**
 * Custom hook to process and manage Gantt chart data
 * @param {Object} rawData - The raw input data
 * @returns {Object} Processed data and state for the Gantt chart
 */
const useGanttData = (rawData) => {
  const [ganttData, setGanttData] = useState({ groups: [], items: [] });
  const [timeWindow, setTimeWindow] = useState(null);
  const [zoomLevel, setZoomLevel] = useState('medium'); // 'large', 'medium', 'small'
  
  // Process the raw data when it changes
  useEffect(() => {
    if (!rawData) return;
    
    const processedData = transformDataForGantt(rawData);
    setGanttData(processedData);
    
    const calculatedWindow = calculateTimeWindow(processedData.items);
    setTimeWindow(calculatedWindow);
  }, [rawData]);
  
  /**
   * Adjusts the time window based on zoom level
   * @param {string} level - The zoom level ('large' = 12hrs, 'medium' = 4hrs, 'small' = 1hr)
   */
  const handleZoomChange = (level) => {
    if (!timeWindow) return;
    
    // Clone the current center point
    const currentCenter = new Date(
      (timeWindow.start.getTime() + timeWindow.end.getTime()) / 2
    );
    
    // Create new start and end times based on zoom level
    let newStart, newEnd;
    
    switch (level) {
      case 'large': // 12-hour range
        newStart = new Date(currentCenter);
        newStart.setHours(currentCenter.getHours() - 6);
        newEnd = new Date(currentCenter);
        newEnd.setHours(currentCenter.getHours() + 6);
        break;
      
      case 'medium': // 4-hour range
        newStart = new Date(currentCenter);
        newStart.setHours(currentCenter.getHours() - 2);
        newEnd = new Date(currentCenter);
        newEnd.setHours(currentCenter.getHours() + 2);
        break;
      
      case 'small': // 1-hour range
        newStart = new Date(currentCenter);
        newStart.setMinutes(currentCenter.getMinutes() - 30);
        newEnd = new Date(currentCenter);
        newEnd.setMinutes(currentCenter.getMinutes() + 30);
        break;
      
      default:
        return; // No change if invalid level
    }
    
    setZoomLevel(level);
    setTimeWindow({ start: newStart, end: newEnd });
  };
  
  return {
    ganttData,
    timeWindow,
    zoomLevel,
    handleZoomChange
  };
};

export default useGanttData;