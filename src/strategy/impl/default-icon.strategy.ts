import { IconStrategy } from '../icon.strategy';

export const defaultIconStrategy: IconStrategy = {
  useLetters: true,
  getIcon: (iconCode?: string) => {
    if (!iconCode) return undefined;
    // Extract first letter and capitalize
    return iconCode.charAt(0).toUpperCase();
  }
};
