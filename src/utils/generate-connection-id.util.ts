/**
 * Generates unique ID for connections
 */
let counter = 0;

export const generateConnectionId = (): string => {
  counter = (counter + 1) % 10000; // Reset after 10000 to keep IDs short
  return `connection_${Date.now()}_${counter}`;
};

