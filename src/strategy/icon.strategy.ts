import React from 'react';

export interface IconStrategy {
  getIcon: (iconCode?: string) => React.ReactNode | undefined;
  useLetters?: boolean;
}
