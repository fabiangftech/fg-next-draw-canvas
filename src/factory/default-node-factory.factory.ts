import { NodeFactoryFunction } from '../components/fg-next-draw-node/model/fgn-node-factory.model';
import { FgnNodeModel } from '../components/fg-next-draw-node/model/fgn-node.model';

/**
 * Default node factory function
 * This factory only handles primitive data, icons are handled by iconStrategy
 */
export const defaultCreateNodeByCode: NodeFactoryFunction = (
  nodeData: Partial<FgnNodeModel>
): Partial<FgnNodeModel> => {
  return {
    ...nodeData,
  };
};

