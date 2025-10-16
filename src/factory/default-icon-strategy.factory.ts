import { IconStrategy } from '../components/shared/icon-strategy.service';

/**
 * Default icon strategy using simple emoji characters
 * This provides fallback icons when no custom iconStrategy is provided
 */
export const defaultIconStrategy: IconStrategy = (iconCode?: string) => {
  switch (iconCode) {
    case 'node-a':
      return 'A';
    case 'node-b':
      return 'B';
    case 'node-c':
      return 'C';
    case 'asm':
      return '🔐';
    case 's3-bucket':
      return '🪣';
    case 'msk-topic':
      return '📨';
    case 'flink-jar':
      return '⚡';
    case 'flink-sql':
      return '📊';
    case 'clickhouse-table':
      return '📋';
    case 'clickhouse-view':
      return '👁️';
    default:
      return 'D';
  }
};
