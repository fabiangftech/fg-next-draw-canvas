import { NodeFactoryFunction } from '../components/fg-next-draw-node/model/fgn-node-factory.model';
import { FgnNodeModel } from '../components/fg-next-draw-node/model/fgn-node.model';

/**
 * Default node factory function for the system
 */
export const defaultCreateNodeByCode: NodeFactoryFunction = (
  code: string | undefined,
  nodeData: Partial<FgnNodeModel>
): Partial<FgnNodeModel> => {
  // Base defaults for all nodes
  const baseDefaults: Partial<FgnNodeModel> = {
    status: 'draft',
    bottomLeftLabel: 'v0.0.1',
    code: code || undefined,
  };

  return {
    ...baseDefaults,
    ...nodeData,
  };
};

