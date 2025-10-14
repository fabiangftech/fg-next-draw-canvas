import React from 'react';
import { SiAmazon, SiApachekafka, SiApacheflink } from 'react-icons/si';

export interface IconConfig {
  icon: React.ReactNode;
  color: string; // hex code
  label: string;
}

export const getIconConfig = (iconCode: string): IconConfig | null => {
  switch (iconCode) {
    case 's3-bucket':
      return {
        icon: React.createElement(SiAmazon as any),
        color: '#FF9900',
        label: 'S3'
      };
    case 'kafka-topic':
      return {
        icon: React.createElement(SiApachekafka as any),
        color: 'purple',
        label: 'Kafka'
      };
    case 'flink-jar':
      return {
        icon: React.createElement(SiApacheflink as any),
        color: '#E6526F',
        label: 'Flink'
      };
    default:
      return {
        icon: 'N',
        color: '#909090',
        label: 'Node'
      };
  }
};
