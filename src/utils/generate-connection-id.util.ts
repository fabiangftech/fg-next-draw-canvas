/**
 * Generates unique ID for connections
 */
export const generateConnectionId = (): string => {
  return `connection_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

