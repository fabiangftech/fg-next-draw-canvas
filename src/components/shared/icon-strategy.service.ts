import React from 'react';

/**
 * Strategy function that maps iconCode to React icon component
 * This follows the Strategy pattern, allowing different implementations
 * for different icon libraries or styling approaches
 */
export type IconStrategy = (iconCode?: string) => React.ReactNode | undefined;
