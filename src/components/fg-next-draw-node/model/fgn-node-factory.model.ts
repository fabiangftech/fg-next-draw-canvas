import { FgnNodeModel } from './fgn-node.model';

export type NodeFactoryFunction = (
  code: string | undefined,
  nodeData: Partial<FgnNodeModel>
) => Partial<FgnNodeModel>;
