import { IconStrategy } from '../components/shared/icon-strategy.service';

export const defaultIconStrategy: IconStrategy = (iconCode?: string) => {
  switch (iconCode) {
    case 'node-a':
      return 'A';
    case 'node-b':
      return 'B';
    case 'node-c':
      return 'C';
    default:
      return 'D';
  }
};
