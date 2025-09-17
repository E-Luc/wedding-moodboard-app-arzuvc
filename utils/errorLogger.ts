
// Global error logging for runtime errors

import { Platform } from "react-native";

// Simple debouncing to prevent duplicate errors
const recentErrors: { [key: string]: boolean } = {};

const clearErrorAfterDelay = (errorKey: string) => {
  setTimeout(() => {
    delete recentErrors[errorKey];
    console.log('Cleared error key:', errorKey);
  }, 100);
};

// Function to send errors to parent window (React frontend)
const sendErrorToParent = (level: string, message: string, data: any) => {
  // Create a simple key to identify duplicate errors
  const errorKey = `${level}:${message}:${JSON.stringify(data)}`;

  // Skip if we've seen this exact error recently
  if (recentErrors[errorKey]) {
    console.log('Skipping duplicate error:', errorKey);
    return;
  }

  // Mark this error as seen and schedule cleanup
  recentErrors[errorKey] = true;
  clearErrorAfterDelay(errorKey);

  try {
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'EXPO_ERROR',
        level: level,
        message: message,
        data: data,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
        source: 'expo-template'
      }, '*');
      console.log('Sent error to parent:', level, message);
    } else {
      // Fallback to console if no parent window
      console.error('🚨 ERROR (no parent):', level, message, data);
    }
  } catch (error) {
    console.error('❌ Failed to send error to parent:', error);
  }
};

// Function to extract meaningful source location from stack trace
const extractSourceLocation = (stack: string): string => {
  if (!stack) {
    console.log('No stack trace provided');
    return '';
  }

  // Look for various patterns in the stack trace
  const patterns = [
    // Pattern for app files: app/filename.tsx:line:column
    /at .+\/(app\/[^:)]+):(\d+):(\d+)/,
    // Pattern for components: components/filename.tsx:line:column
    /at .+\/(components\/[^:)]+):(\d+):(\d+)/,
    // Pattern for any .tsx/.ts files
    /at .+\/([^/]+\.tsx?):(\d+):(\d+)/,
    // Pattern for bundle files with source maps
    /at .+\/([^/]+\.bundle[^:]*):(\d+):(\d+)/,
    // Pattern for any JavaScript file
    /at .+\/([^/\s:)]+\.[jt]sx?):(\d+):(\d+)/
  ];

  for (const pattern of patterns) {
    const match = stack.match(pattern);
    if (match) {
      const location = ` | Source: ${match[1]}:${match[2]}:${match[3]}`;
      console.log('Extracted source location:', location);
      return location;
    }
  }

  // If no specific pattern matches, try to find any file reference
  const fileMatch = stack.match(/at .+\/([^/\s:)]+\.[jt]sx?):(\d+)/);
  if (fileMatch) {
    const location = ` | Source: ${fileMatch[1]}:${fileMatch[2]}`;
    console.log('Extracted file location:', location);
    return location;
  }

  console.log('No source location found in stack');
  return '';
};

// Function to get caller information from stack trace
const getCallerInfo = (): string => {
  const stack = new Error().stack || '';
  const lines = stack.split('\n');

  console.log('Getting caller info from stack lines:', lines.length);

  // Skip the first few lines (Error, getCallerInfo, console override)
  for (let i = 3; i < lines.length; i++) {
    const line = lines[i];
    if (line.indexOf('app/') !== -1 || line.indexOf('components/') !== -1 || line.indexOf('.tsx') !== -1 || line.indexOf('.ts') !== -1) {
      const match = line.match(/at .+\/([^/\s:)]+\.[jt]sx?):(\d+):(\d+)/);
      if (match) {
        const callerInfo = ` | Called from: ${match[1]}:${match[2]}:${match[3]}`;
        console.log('Found caller info:', callerInfo);
        return callerInfo;
      }
    }
  }

  console.log('No caller info found');
  return '';
};

export const setupErrorLogging = () => {
  console.log('Setting up error logging...');
  
  // Capture unhandled errors in web environment
  if (typeof window !== 'undefined') {
    console.log('Setting up window error handlers...');
    
    // Override window.onerror to catch JavaScript errors
    window.onerror = (message, source, lineno, colno, error) => {
      const sourceFile = source ? source.split('/').pop() : 'unknown';
      const errorData = {
        message: message,
        source: `${sourceFile}:${lineno}:${colno}`,
        line: lineno,
        column: colno,
        error: error?.stack || error,
        timestamp: new Date().toISOString()
      };

      console.error('🚨 RUNTIME ERROR:', errorData);
      sendErrorToParent('error', 'JavaScript Runtime Error', errorData);
      return false; // Don't prevent default error handling
    };
    
    // check if platform is web
    if (Platform.OS === 'web') {
      console.log('Setting up unhandled rejection handler...');
      
      // Capture unhandled promise rejections
      window.addEventListener('unhandledrejection', (event) => {
        const errorData = {
          reason: event.reason,
          timestamp: new Date().toISOString()
        };

        console.error('🚨 UNHANDLED PROMISE REJECTION:', errorData);
        sendErrorToParent('error', 'Unhandled Promise Rejection', errorData);
      });
    }
  }

  // Store original console methods
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  console.log('Error logging setup complete');

  // UNCOMMENT BELOW CODE TO GET MORE SENSITIVE ERROR LOGGING (usually many errors triggered per 1 uncaught runtime error)

  // Override console.error to capture more detailed information
  // console.error = (...args: any[]) => {
  //   const stack = new Error().stack || '';
  //   const sourceInfo = extractSourceLocation(stack);
  //   const callerInfo = getCallerInfo();

  //   // Create enhanced message with source information
  //   const enhancedMessage = args.join(' ') + sourceInfo + callerInfo;

  //   // Add timestamp and make it stand out in Metro logs
  //   originalConsoleError('🔥🔥🔥 ERROR:', new Date().toISOString(), enhancedMessage);

  //   // Also send to parent
  //   sendErrorToParent('error', 'Console Error', enhancedMessage);
  // };

  // Override console.warn to capture warnings with source location
  // console.warn = (...args: any[]) => {
  //   const stack = new Error().stack || '';
  //   const sourceInfo = extractSourceLocation(stack);
  //   const callerInfo = getCallerInfo();

  //   // Create enhanced message with source information
  //   const enhancedMessage = args.join(' ') + sourceInfo + callerInfo;

  //   originalConsoleWarn('⚠️ WARNING:', new Date().toISOString(), enhancedMessage);

  //   // Also send to parent
  //   sendErrorToParent('warn', 'Console Warning', enhancedMessage);
  // };

  // // Also override console.log to catch any logs that might contain error information
  // console.log = (...args: any[]) => {
  //   const message = args.join(' ');

  //   // Check if this log message contains warning/error keywords
  //   if (message.indexOf('deprecated') !== -1 || message.indexOf('warning') !== -1 || message.indexOf('error') !== -1) {
  //     const stack = new Error().stack || '';
  //     const sourceInfo = extractSourceLocation(stack);
  //     const callerInfo = getCallerInfo();

  //     const enhancedMessage = message + sourceInfo + callerInfo;

  //     originalConsoleLog('📝 LOG (potential issue):', new Date().toISOString(), enhancedMessage);
  //     sendErrorToParent('info', 'Console Log (potential issue)', enhancedMessage);
  //   } else {
  //     // Normal log, just pass through
  //     originalConsoleLog(...args);
  //   }
  // };

  // Try to intercept React Native warnings at a lower level
  if (typeof window !== 'undefined' && (window as any).__DEV__) {
    console.log('Setting up React internals error handling...');
    
    // Override React's warning system if available
    const originalWarn = (window as any).console?.warn || console.warn;

    // Monkey patch any React warning functions
    if ((window as any).React && (window as any).React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      const internals = (window as any).React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      if (internals.ReactDebugCurrentFrame) {
        const originalGetStackAddendum = internals.ReactDebugCurrentFrame.getStackAddendum;
        internals.ReactDebugCurrentFrame.getStackAddendum = function() {
          const stack = originalGetStackAddendum ? originalGetStackAddendum.call(this) : '';
          console.log('React stack addendum:', stack);
          return stack + ' | Enhanced by error logger';
        };
      }
    }
  }
};

// Export the utility functions for external use
export { clearErrorAfterDelay, sendErrorToParent, extractSourceLocation, getCallerInfo };
