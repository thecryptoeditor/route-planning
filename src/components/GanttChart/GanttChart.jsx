import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import './GanttChart.css';
import TimeRangeSlider from './TimeRangeSlider';
import useGanttData from '../../hooks/useGanttData';

/**
 * GanttChart component that displays route and order data in a timeline
 * @param {Object} props - Component props
 * @param {Object} props.data - The input data with routes and orders
 */

const GanttChart = ({ data }) => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const [timeline, setTimeline] = useState(null);
  
  // Process data using custom hook
  const { ganttData, timeWindow, zoomLevel, handleZoomChange } = useGanttData(data);
  
  // Initialize and update timeline when data changes
  useEffect(() => {
    if (!ganttData || !ganttData.groups || !ganttData.items || ganttData.items.length === 0) {
      return;
    }
    
    // Convert data to vis-timeline DataSet format
    const groups = new DataSet(ganttData.groups);
    const items = new DataSet(ganttData.items);
    
    // Initialize timeline if it doesn't exist
    if (!timeline && containerRef.current) {
      const options = {
        stack: true,
        stackSubgroups: true,
        verticalScroll: true,
        maxHeight: '600px',
        horizontalScroll: true,
        zoomKey: 'ctrlKey',
        orientation: 'top',
        showTooltips: true,
        tooltip: {
          followMouse: true,
          overflowMethod: 'flip'
        },
        format: {
          minorLabels: {
            minute: 'h:mm a',
            hour: 'h:mm a'
          }
        },
        snap: null, // Don't snap when moving items
        editable: false, // Make it non-editable for this example
        margin: {
          item: {
            horizontal: 10,
          }
        }
      };
      
      // Create the timeline instance
      const newTimeline = new Timeline(
        containerRef.current,
        items,
        groups,
        options
      );
      
      setTimeline(newTimeline);
      timelineRef.current = newTimeline;
      
      // Add event listener for timeline's initial load
      newTimeline.on('rangechanged', (properties) => {
        // This fires when the timeline's visible range changes
        console.log('Range changed:', properties);
      });
    } else if (timeline) {
      // Update data if timeline already exists
      timeline.setGroups(groups);
      timeline.setItems(items);
    }
  }, [ganttData, timeline]);
  
  // Update window/zoom level when it changes
  useEffect(() => {
    if (timeline && timeWindow) {
      timeline.setWindow(timeWindow.start, timeWindow.end, {
        animation: true
      });
    }
  }, [timeline, timeWindow]);
  
  return (
    <div className="gantt-chart-container">
      <TimeRangeSlider zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      
      <div className="timeline-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#1976d2' }}></div>
          <div className="legend-label">Route 1</div>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#388e3c' }}></div>
          <div className="legend-label">Route 2</div>
        </div>
      </div>
      
      <div className="gantt-chart" ref={containerRef}></div>
    </div>
  );
};

export default GanttChart;