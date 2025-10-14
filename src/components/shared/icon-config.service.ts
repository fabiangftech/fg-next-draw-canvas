import React from 'react';
import { SiAmazon, SiApachekafka, SiApacheflink } from 'react-icons/si';

// Create icon components
const S3Icon = () => React.createElement(SiAmazon as any);
const KafkaIcon = () => React.createElement(SiApachekafka as any);
const FlinkIcon = () => React.createElement(SiApacheflink as any);

/**
 * Interface for icon configuration
 */
export interface IconConfig {
  icon: React.ReactNode;
  color: string; // hex code
  label: string;
}

/**
 * Centralized function to get icon configuration by code
 * @param iconCode - The icon identifier code
 * @returns IconConfig object with icon, color, and label, or null if not found
 */
export const getIconConfig = (iconCode: string): IconConfig | null => {
  switch (iconCode) {
    case 's3-bucket':
      return {
        icon: React.createElement(S3Icon),
        color: '#FF9900',
        label: 'S3'
      };
    case 'kafka-topic':
      return {
        icon: React.createElement(KafkaIcon),
        color: '#000000',
        label: 'Kafka'
      };
    case 'flink-jar':
      return {
        icon: React.createElement(FlinkIcon),
        color: '#E6526F',
        label: 'Flink'
      };
    default:
      return null;
  }
};
