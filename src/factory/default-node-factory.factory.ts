import { NodeFactoryFunction } from '../components/fg-next-draw-node/model/fgn-node-factory.model';
import { FgnNodeModel } from '../components/fg-next-draw-node/model/fgn-node.model';

export const defaultCreateNodeByCode: NodeFactoryFunction = (
  nodeData: Partial<FgnNodeModel>
): Partial<FgnNodeModel> => {
  return {
    ...nodeData,
  };
};

