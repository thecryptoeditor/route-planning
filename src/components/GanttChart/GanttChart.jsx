import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import './GanttChart.css';
import TimeRangeSlider from './TimeRangeSlider';
import useGanttData from '../../hooks/useGanttData';

const GanttChart = ({ data }) => {
  const timelineRef = useRef(null);
  const containerRef = useRef(null);
  const [timeline, setTimeline] = useState(null);
  
  const { ganttData, timeWindow, zoomLevel, handleZoomChange } = useGanttData(data);
  
  useEffect(() => {
    if (!ganttData || !ganttData.groups || !ganttData.items || ganttData.items.length === 0) {
      return;
    }
    
    const groups = new DataSet(ganttData.groups);
    const items = new DataSet(ganttData.items);
    
    if (!timeline && containerRef.current) {
      const options = {
        stack: false,
        stackSubgroups: true,
        verticalScroll: true,
        maxHeight: '800px',
        horizontalScroll: true,
        zoomKey: 'ctrlKey',
        orientation: 'top',
        minHeight: '100vh',
        format: {
          minorLabels: {
            minute: 'h:mm a',
            hour: 'h:mm a'
          },
          majorLabels: {
            millisecond: '',
            second: '',
            minute: '',
            hour: '',
            weekday: '',
            day: '',
            week: '',
            month: '',
            year: ''
          }
        },
        snap: null,
        editable: false,
        margin: {
          item: {
            horizontal: 10,
          }
        },
        template: function (item) {
          return `<div class="timeline-item-content">${item.content}</div>`;
        }
      };
      
      // Creating the timeline instance
      const newTimeline = new Timeline(
        containerRef.current,
        items,
        groups,
        options
      );
      
      setTimeline(newTimeline);
      timelineRef.current = newTimeline;
      
    } else if (timeline) {
      timeline.setGroups(groups);
      timeline.setItems(items);
    }
  }, [ganttData, timeline]);
  
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
      <div className="gantt-chart" ref={containerRef}></div>
    </div>
  );
};

export default GanttChart;