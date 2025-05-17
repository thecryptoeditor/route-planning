import { parseTimeString } from './timeUtils';

/**
 * Transforms the input JSON data to the format required by vis-timeline
 * @param {Object} data - The input data in the specified JSON format
 * @returns {Object} Object containing groups and items for vis-timeline
 */
export const transformDataForGantt = (data) => {
  if (!data || !data.routes || !Array.isArray(data.routes)) {
    return { groups: [], items: [] };
  }

  // Set a base date to use for time calculations (today)
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0); // Reset time to midnight for clean calculations
  
  const groups = [];
  const items = [];
  
  // Process each route
  data.routes.forEach((routeData, routeIndex) => {
    const routeId = `route-${routeIndex + 1}`;
    
    // Create a group for each route
    groups.push({
      id: routeId,
      content: `Route ${routeIndex + 1}`,
      order: routeIndex
    });
    
    // Process each order/sequence in the route
    routeData.route.forEach((orderData, orderIndex) => {
      const startTime = parseTimeString(orderData.start_time, baseDate);
      const endTime = parseTimeString(orderData.end_time, baseDate);
      
      if (!startTime || !endTime) {
        console.error(`Invalid time data for order ${orderData.seq}`);
        return; // Skip this item
      }
      
      // Create an item for each order
      items.push({
        id: `${routeId}-order-${orderData.seq}`,
        group: routeId,
        content: `${orderData.seq}`,
        start: startTime,
        end: endTime,
        title: `Order ${orderData.seq}: ${orderData.start_time} - ${orderData.end_time}`,
        style: `background-color: ${getOrderColor(routeIndex, orderIndex)};`,
        className: 'gantt-order-item'
      });
    });
  });
  
  return { groups, items };
};

/**
 * Generates a color for an order based on its route and sequence
 * @param {number} routeIndex - The index of the route
 * @param {number} orderIndex - The index of the order within the route
 * @returns {string} A CSS color value
 */
const getOrderColor = (routeIndex, orderIndex) => {
  // Base colors for routes (can be expanded)
  const baseColors = [
    '#e91e63', // Pink
    '#2196f3', // Blue
    '#ffc107', // Yellow
    '#4caf50', // Green
    '#9c27b0', // Purple
    '#795548', // Brown
    '#8bc34a', // Lime
    '#2e7d32', // Dark Green
    '#3f51b5', // Indigo
    '#1a237e'  // Navy
  ];
  
  // Get base color for the route
  const baseColor = baseColors[routeIndex % baseColors.length];
  
  // Optional: slightly vary the color by order index
  return baseColor;
};

/**
 * Calculates appropriate time window for initial display
 * @param {Array} items - The items array for vis-timeline
 * @returns {Object} Object with start and end times
 */
export const calculateTimeWindow = (items) => {
  if (!items || items.length === 0) {
    // Default to 8AM-8PM today if no items
    const today = new Date();
    today.setHours(8, 0, 0, 0);
    const end = new Date(today);
    end.setHours(20, 0, 0, 0);
    return { start: today, end };
  }
  
  // Find earliest start and latest end
  let earliest = new Date(items[0].start);
  let latest = new Date(items[0].end);
  
  items.forEach(item => {
    const itemStart = new Date(item.start);
    const itemEnd = new Date(item.end || item.start);
    
    if (itemStart < earliest) earliest = itemStart;
    if (itemEnd > latest) latest = itemEnd;
  });
  
  // Add some padding (1 hour on each side)
  earliest.setHours(earliest.getHours() - 1);
  latest.setHours(latest.getHours() + 1);
  
  return { start: earliest, end: latest };
};