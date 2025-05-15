import React, { useEffect, useRef, useState } from 'react';
import { Timeline } from "vis-timeline/standalone";
import { DataSet } from "vis-data";
import "vis-timeline/styles/vis-timeline-graph2d.css";
import './GanttChart.css';
import TimeRangeSlider from './TimeRangeSlider';
import useGanttData from '../../hooks/useGanttData';

// Define route colors for consistent styling
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
  'route-navy'
];

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
        maxHeight: '800px',
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
        snap: null, // Don't snap when moving items
        editable: false, // Make it non-editable for this example
        margin: {
          item: {
            horizontal: 10,
          }
        },
        template: function (item) {
          return `<div class="timeline-item-content">${item.content}</div>`;
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
      
      // After the timeline renders, add home icons to each route
      setTimeout(() => {
        addRouteIcons();
        addRouteBackgrounds();
        addRouteIcons();
        addBackgroundLines();
        // Hide the date row
        hideTimelineDate();
        // Ensure content is visible initially
        ensureItemContentVisible();
      }, 100);
      
    } else if (timeline) {
      // Update data if timeline already exists
      timeline.setGroups(groups);
      timeline.setItems(items);
      
      // Re-add home icons after data updates
      setTimeout(() => {
        addRouteIcons();
        addRouteBackgrounds();
        addRouteIcons();
        addBackgroundLines();
        hideTimelineDate();
        ensureItemContentVisible();
      }, 100);
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

    // Ensure item content (numbers) remain visible during horizontal scrolling
  const ensureItemContentVisible = () => {
    if (!timeline) return;
    
    try {
      // Select all timeline items
      const timelineItems = document.querySelectorAll('.vis-item');
      
      // Add 'keep-content-visible' class to all items
      timelineItems.forEach(item => {
        if (!item.classList.contains('keep-content-visible')) {
          item.classList.add('keep-content-visible');
        }
        
        // Add vis-point class to ensure proper styling for points
        if (!item.classList.contains('vis-point')) {
          item.classList.add('vis-point');
        }
        
        // Find the content element
        const content = item.querySelector('.timeline-item-content, .vis-item-content');
        if (!content) return;
        
        // Get the original content from the item's data
        const itemId = item.getAttribute('data-id');
        if (!itemId) return;
        
        try {
          const itemData = timeline.itemsData.get(itemId);
          
          // Use originalContent property or fallback to item.content
          let displayContent = '';
          if (itemData && itemData.originalContent) {
            displayContent = itemData.originalContent;
          } else if (itemData && itemData.content) {
            displayContent = itemData.content;
          }
          
          // Set the data-content attribute only if we have content
          if (displayContent) {
            content.setAttribute('data-content', displayContent);
            // Add the actual content inside the element too
            content.textContent = displayContent;
          }
          
          // Ensure visibility
          content.style.display = 'flex';
          content.style.visibility = 'visible';
          content.style.opacity = '1';
          content.style.zIndex = '35';
          
          // Keep original position (don't override timeline's positioning)
          // Make sure the item stays positioned by time
          item.style.position = 'absolute';
          
          // Ensure the parent item is also visible
          item.style.display = 'flex';
          item.style.visibility = 'visible';
          item.style.opacity = '1';
        } catch (err) {
          console.warn('Error processing item:', err);
        }
      });
    } catch (error) {
      console.error('Error in ensureItemContentVisible:', error);
    }
  };

  const addBackgroundLines = () => {
    // Clear existing background lines
    document.querySelectorAll('.route-background-line').forEach(line => {
      line.remove();
    });
    
    // Get all route containers
    const routeElements = document.querySelectorAll('.vis-group');
    
    routeElements.forEach((route, index) => {
      // Create a background line for each route
      const line = document.createElement('div');
      line.className = 'route-background-line';
      line.style.zIndex = '5'; // Ensure it's behind events
      
      const foreground = route.querySelector('.vis-foreground');
      if (foreground) {
        // Insert at beginning of foreground to be behind events
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
    // Clear existing backgrounds
    document.querySelectorAll('.route-row-background').forEach(bg => {
      bg.remove();
    });
    
    // Get all route containers
    const routeElements = document.querySelectorAll('.vis-group');
    
    routeElements.forEach(route => {
      // Create a background for each route
      const background = document.createElement('div');
      background.className = 'route-row-background';
      
      // Insert at the beginning of the route element to ensure it's behind other elements
      route.insertBefore(background, route.firstChild);
    });
  };
  
  // Add home icons to the beginning of each route
  const addRouteIcons = () => {
    // Get all route containers
    const routeElements = document.querySelectorAll('.vis-group');
    
    routeElements.forEach((route, index) => {
      // Add route color class to group
      route.classList.add(ROUTE_COLORS[index % ROUTE_COLORS.length]);
      
      // Check if we already added an icon
      if (route.querySelector('.route-start-icon')) {
        return;
      }
      
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
  
  // Hide the date row in the timeline
  const hideTimelineDate = () => {
    const dateRow = document.querySelector('.vis-time-axis.vis-foreground .vis-major');
    if (dateRow) {
      dateRow.style.display = 'none';
    }
  };
  
  return (
    <div className="gantt-chart-container">
      <TimeRangeSlider zoomLevel={zoomLevel} onZoomChange={handleZoomChange} />
      <div className="gantt-chart" ref={containerRef}></div>
    </div>
  );
};

export default GanttChart;