import { FgnNodeModel } from './fgn-node.model';

export type NodeFactoryFunction = (
  code: string | undefined,
  nodeData: Partial<FgnNodeModel>
) => Partial<FgnNodeModel>;

export const createDefaultNodeByCode: NodeFactoryFunction = (
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

