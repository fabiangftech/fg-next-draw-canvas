import { FgnNodeStatusStyle } from '../components/fg-next-node/model/fgn-node-status-style.model';

export interface StatusStrategy {
  getStyle: (status: string) => FgnNodeStatusStyle;
  defaultStatus: string;
}
