import React from 'react';

/**
 * Strategy interface that maps iconCode to React icon component and defines default behavior
 * This follows the Strategy pattern, allowing different implementations
 * for different icon libraries or styling approaches
 */
export interface IconStrategy {
  getIcon: (iconCode?: string) => React.ReactNode | undefined;
  useLetters: boolean; // true = usa letras, false = usa iconos personalizados
}
