import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import './GanttChart.css';
import TimeRangeSlider from './TimeRangeSlider';
import useGanttData from '../../hooks/useGanttData';

// Route colors for consistent styling
const ROUTE_COLORS = [
  'route-pink',
  'route-blue',
  'route-yellow',
  'route-green',
  'route-purple',
  'route-brown',
  'route-lime',
  'route-dark-green',
  'route-indigo',
];

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
        timeAxis: {
          scale: 'minute',
          step: 30
        },
        showMinorLabels: true,
        stack: false,
        stackSubgroups: true,
        verticalScroll: true,
        maxHeight: '800px',
        horizontalScroll: true,
        zoomKey: 'ctrlKey',
        orientation: 'top',
        minHeight: '600px',
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

    // Adding effects by CSS
    setTimeout(() => {
      applyTimelineStyling();
    }, 100);

  }, [ganttData, timeline]);
  
  useEffect(() => {
    if (timeline && timeWindow) {
      timeline.setWindow(timeWindow.start, timeWindow.end, {
        animation: true
      });
    }
  }, [timeline, timeWindow]);


  // Combined function to apply all styling at once to prevent duplication
  const applyTimelineStyling = () => {
    addRouteIcons();
    addBackgroundLines();
    addRouteBackgrounds();
  };

    // Add home icons to the beginning of each route
    const addRouteIcons = () => {
      const foreground = document.querySelector('.vis-foreground');
      const routeElements = foreground.querySelectorAll('.vis-group');
      routeElements.forEach((route, index) => {
        route.classList.add(ROUTE_COLORS[index % ROUTE_COLORS.length]);
        
        // Create and add home icon
        const iconContainer = document.createElement('div');
        iconContainer.className = 'route-start-icon';
        iconContainer.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        `;
        
        route.appendChild(iconContainer);
      });
    };
  

  // Add horizontal lines to each route
  const addBackgroundLines = () => {
    const routeElements = document.querySelectorAll('.vis-group');
    console.log('routeElements', routeElements);
    routeElements.forEach((route, index) => {
      const line = document.createElement('div');
      line.className = 'route-background-line';
      line.style.zIndex = '5'; // Ensure it's behind events
      
      const foreground = route.querySelector('.vis-foreground');
      if (foreground) {
        if (foreground.firstChild) {
          foreground.insertBefore(line, foreground.firstChild);
        } else {
          foreground.appendChild(line);
        }
      } else {
        route.appendChild(line);
      }
    });
  };

  const addRouteBackgrounds = () => {
    // Get all route containers
    const foreground = document.querySelector('.vis-foreground');
    const routeElements = foreground.querySelectorAll('.vis-group');
    
    routeElements.forEach(route => {
      // Create a background for each route
      const background = document.createElement('div');
      background.className = 'route-row-background';
      
      // Insert at the beginning of the route element to ensure it's behind other elements
      route.insertBefore(background, route.firstChild);
    });
  };
  
  
  return (
    <div className="gantt-chart-container">
      <TimeRangeSlider zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      <div className="gantt-chart" ref={containerRef}></div>
    </div>
  );
};

export default GanttChart;