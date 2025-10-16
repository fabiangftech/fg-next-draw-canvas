import { FgnNodeModel } from './fgn-node.model';

export type NodeFactoryFunction = (
  nodeData: Partial<FgnNodeModel>
) => Partial<FgnNodeModel>;
