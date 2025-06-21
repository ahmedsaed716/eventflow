// src/utils/dateFormatter.js
import { parseISO, formatDistanceToNow, isValid } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime, format as formatTz } from 'date-fns-tz';
import { ar } from 'date-fns/locale';

// Default timezone for Egypt
const EGYPT_TIMEZONE = 'Africa/Cairo';
const DEFAULT_LOCALE = 'en-EG';

// Format date in Egypt timezone
export const formatDateEgypt = (date, formatString = 'PPP', options = {}) => {
  const {
    timezone = EGYPT_TIMEZONE,
    locale = null
  } = options;

  try {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    
    const zonedDate = utcToZonedTime(dateObj, timezone);
    
    return formatTz(zonedDate, formatString, {
      timeZone: timezone,
      locale: locale === 'ar' ? ar : undefined
    });
  } catch (error) {
    console.log('Date formatting error:', error);
    return 'Invalid Date';
  }
};

// Format time in Egypt timezone
export const formatTimeEgypt = (date, options = {}) => {
  return formatDateEgypt(date, 'HH:mm', options);
};

// Format date and time in Egypt timezone
export const formatDateTimeEgypt = (date, options = {}) => {
  return formatDateEgypt(date, 'PPP HH:mm', options);
};

// Format for event display (user-friendly)
export const formatEventDate = (startDate, endDate = null, options = {}) => {
  const {
    timezone = EGYPT_TIMEZONE,
    includeTime = true,
    locale = null
  } = options;

  try {
    if (!startDate) return '';
    
    const startFormatted = formatDateEgypt(
      startDate, 
      includeTime ? 'EEEE, MMMM d, yyyy \\at HH:mm' : 'EEEE, MMMM d, yyyy',
      { timezone, locale }
    );
    
    if (!endDate) return startFormatted;
    
    const startDateObj = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    const endDateObj = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    
    // Check if same day
    const startZoned = utcToZonedTime(startDateObj, timezone);
    const endZoned = utcToZonedTime(endDateObj, timezone);
    
    const isSameDay = formatTz(startZoned, 'yyyy-MM-dd', { timeZone: timezone }) === 
                      formatTz(endZoned, 'yyyy-MM-dd', { timeZone: timezone });
    
    if (isSameDay && includeTime) {
      const endTime = formatTz(endZoned, 'HH:mm', { timeZone: timezone });
      return `${startFormatted} - ${endTime}`;
    } else {
      const endFormatted = formatDateEgypt(
        endDate,
        includeTime ? 'EEEE, MMMM d, yyyy \\at HH:mm' : 'EEEE, MMMM d, yyyy',
        { timezone, locale }
      );
      return `${startFormatted} - ${endFormatted}`;
    }
  } catch (error) {
    console.log('Event date formatting error:', error);
    return 'Invalid Date Range';
  }
};

// Relative time from now (e.g., "2 hours ago")
export const formatRelativeTime = (date, options = {}) => {
  const {
    addSuffix = true,
    locale = null
  } = options;

  try {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid Date';
    
    return formatDistanceToNow(dateObj, {
      addSuffix,
      locale: locale === 'ar' ? ar : undefined
    });
  } catch (error) {
    console.log('Relative time formatting error:', error);
    return 'Unknown time';
  }
};

// Convert local time to UTC for storage
export const toUTC = (date, timezone = EGYPT_TIMEZONE) => {
  try {
    if (!date) return null;
    
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return null;
    
    return zonedTimeToUtc(dateObj, timezone);
  } catch (error) {
    console.log('UTC conversion error:', error);
    return null;
  }
};

// Get current Egypt time
export const nowInEgypt = () => {
  return utcToZonedTime(new Date(), EGYPT_TIMEZONE);
};

// Check if event is happening now
export const isEventActive = (startDate, endDate = null) => {
  try {
    const now = new Date();
    const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
    
    if (!isValid(start)) return false;
    
    if (!endDate) {
      // If no end date, consider active for the day
      const dayEnd = new Date(start);
      dayEnd.setHours(23, 59, 59, 999);
      return now >= start && now <= dayEnd;
    }
    
    const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
    if (!isValid(end)) return false;
    
    return now >= start && now <= end;
  } catch (error) {
    console.log('Event active check error:', error);
    return false;
  }
};

// Date presets for common formats
export const dateFormats = {
  shortDate: 'MM/dd/yyyy',
  longDate: 'EEEE, MMMM d, yyyy',
  time: 'HH:mm',
  dateTime: 'MM/dd/yyyy HH:mm',
  iso: "yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx",
  dayOfWeek: 'EEEE',
  month: 'MMMM',
  year: 'yyyy'
};

export default {
  formatDateEgypt,
  formatTimeEgypt,
  formatDateTimeEgypt,
  formatEventDate,
  formatRelativeTime,
  toUTC,
  nowInEgypt,
  isEventActive,
  dateFormats
};