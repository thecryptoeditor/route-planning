import { parseISO, format, parse } from 'date-fns';

/**
 * Converts a time string (like "10:00 AM") to a Date object
 * @param {string} timeStr - The time string (e.g., "10:00 AM")
 * @param {Date} baseDate - The base date to use (defaults to today)
 * @returns {Date} The parsed date object
 */
export const parseTimeString = (timeStr, baseDate = new Date()) => {
  try {
    // Parse the time string using date-fns
    const parsedTime = parse(timeStr, 'h:mm a', baseDate);
    return parsedTime;
  } catch (error) {
    console.error(`Error parsing time: ${timeStr}`, error);
    return null;
  }
};

/**
 * Formats a Date object to a time string
 * @param {Date} date - The date object
 * @param {string} formatStr - The format string to use (default: 'h:mm a')
 * @returns {string} The formatted time string
 */
export const formatTime = (date, formatStr = 'h:mm a') => {
  try {
    return format(date, formatStr);
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return '';
  }
};

/**
 * Calculates the duration between two time strings in milliseconds
 * @param {string} startTimeStr - The start time string (e.g., "10:00 AM")
 * @param {string} endTimeStr - The end time string (e.g., "12:00 PM")
 * @returns {number} The duration in milliseconds
 */
export const calculateDuration = (startTimeStr, endTimeStr) => {
  const startDate = parseTimeString(startTimeStr);
  const endDate = parseTimeString(endTimeStr);
  
  if (!startDate || !endDate) {
    return 0;
  }
  
  return endDate.getTime() - startDate.getTime();
};