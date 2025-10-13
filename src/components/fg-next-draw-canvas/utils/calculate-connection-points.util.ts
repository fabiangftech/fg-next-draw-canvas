import { ConnectionPoint } from '../../fg-next-draw-node/model/fgn-node.model';

export const calculateConnectionPoints = (
  x: number,
  y: number,
  width: number,
  height: number
): { left: ConnectionPoint; right: ConnectionPoint } => {
  return {
    left: {
      x: x,
      y: y + height / 2
    },
    right: {
      x: x + width,
      y: y + height / 2
    }
  };
};

